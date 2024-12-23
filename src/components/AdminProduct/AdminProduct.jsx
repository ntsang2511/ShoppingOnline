import { Button, Space } from 'antd'
import { WrapperHeader } from './style'
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import { useEffect, useRef, useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import { error, success } from '../Message/Message'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useNavigate } from 'react-router-dom'

function AdminProduct() {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  // const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const user = useSelector((state) => state?.user)
  const [rowSelected, setRowSelected] = useState('')

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data
    const res = ProductService.deleteProduct(id, token)
    return res
  })
  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data
    const res = ProductService.deleteManyProduct(ids, token)
    return res
  })
  const getAllProduct = async () => {
    const res = await ProductService.getProductBySearch({ search: '', limit: 3 })
    return res
  }

  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      { id: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch()
        }
      }
    )
  }

  const {
    data: deletedData,
    isPending: isLoadingDelete,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted
  } = mutationDelete

  const {
    data: deletedManyData,
    isPending: isLoadingDeleteMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany
  } = mutationDeleteMany

  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProduct
  })

  const { isPending: isLoading, data: products } = queryProduct

  const handleOnClick = () => {
    navigate('/products/create-product')
  }

  const handleDelete = () => {
    setIsModalOpenDelete(true)
  }
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch()
        }
      }
    )
  }
  console.log(rowSelected)
  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleDelete()} />
        <EditOutlined
          style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => {
            console.log(record._id)
            navigate(`/products/edit/${record._id}`) // Điều hướng trực tiếp từ record._id
          }}
        />
      </div>
    )
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    // setSearchText(selectedKeys[0])
    // setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      }
    }
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   )
  })

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (img) => {
        return (
          <img
            src={img}
            style={{
              height: '60px',
              width: '60px',
              // borderRadius: '50%',
              objectFit: 'cover'
            }}
            alt="avatar"
          />
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 50',
          value: '>='
        },
        {
          text: '<= 50',
          value: '<='
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 50
        } else if (value === '<=') {
          return record.price <= 50
        }
      }
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>='
        },
        {
          text: '<= 3',
          value: '<='
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.rating >= 3
        } else if (value === '<=') {
          return record.rating <= 3
        }
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: [
        {
          text: 'Phone',
          value: 'phone'
        },
        {
          text: 'Đồng hồ',
          value: 'đồng hồ'
        }
      ],
      onFilter: (value, record) => {
        return record.type.includes(value)
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    }
  ]
  const dataTable = products?.data.map((product) => {
    return { ...product, key: product._id }
  })

  useEffect(() => {
    if (isSuccessDeletedMany && deletedManyData?.status === 'OK') {
      success()
    } else if (isErrorDeletedMany) {
      error()
    }
  }, [isSuccessDeletedMany])
  useEffect(() => {
    if (isSuccessDeleted && deletedData?.status === 'OK') {
      success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      error()
    }
  }, [isSuccessDeleted])
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button
          style={{ fontSize: '30px', height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }}
          icon={<AppstoreAddOutlined style={{ fontSize: '30px' }} />}
          onClick={handleOnClick}
        >
          Add
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProducts}
          columns={columns}
          data={dataTable}
          isLoading={isLoading}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id)
              }
            }
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Xóa sản phẩm"
        onOk={handleDeleteProduct}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
      >
        <Loading isLoading={isLoadingDelete}>
          <div>Bạn có chắc xóa sản phẩm này không</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct
