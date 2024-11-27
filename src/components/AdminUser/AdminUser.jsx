import { Button, Space } from 'antd'
import { WrapperHeader } from './style'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { useEffect, useRef, useState } from 'react'
import { error, success } from '../Message/Message'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useNavigate } from 'react-router-dom'

function AdminUser() {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  // const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const user = useSelector((state) => state?.user)
  const [rowSelected, setRowSelected] = useState('')

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data
    const res = UserService.deleteUser(id, token)
    return res
  })
  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data
    const res = UserService.deleteManyUser(ids, token)
    return res
  })
  const getAllUser = async () => {
    const res = await UserService.getAllUser()
    return res
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

  const queryUser = useQuery({
    queryKey: ['user'],
    queryFn: getAllUser
  })
  const { isPending: isLoading, data: users } = queryUser

  const handleDelete = () => {
    setIsModalOpenDelete(true)
  }
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch()
        }
      }
    )
  }
  const handleDeleteManyUsers = (ids) => {
    mutationDeleteMany.mutate(
      { id: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch()
        }
      }
    )
  }
  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={handleDelete} />
        <EditOutlined
          style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }}
          onClick={() => {
            console.log(record._id)
            navigate(`/users/edit/${record._id}`)
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
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (img) => {
        return (
          <img
            src={img}
            style={{
              height: '60px',
              width: '60px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            alt="user image"
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
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Role',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'Admin',
          value: 'true'
        },
        {
          text: 'User',
          value: 'false'
        }
      ],
      onFilter: (value, record) => {
        if (value === 'true') {
          return record.isAdmin == true
        } else if (value === 'false') {
          return record.isAdmin == false
        }
      },
      render: (isAd) => {
        return isAd === true ? <div>Admin</div> : <div>User</div>
      }
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address - b.address,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ...getColumnSearchProps('createdAt')
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      ...getColumnSearchProps('updatedAt')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    }
  ]
  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleString('vi-VN') // Sử dụng "vi-VN" cho định dạng Việt Nam
  }
  const dataTable = users?.data.map((user) => {
    return {
      ...user,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
      key: user._id
    }
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

  // (e) => {
  //   setStateUserDetails({
  //     ...stateUserDetails,
  //     [e.target.name]: e.target.value
  //   })
  // }

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: '20px' }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyUsers}
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
        title="Xóa người dùng"
        onOk={handleDeleteUser}
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

export default AdminUser
