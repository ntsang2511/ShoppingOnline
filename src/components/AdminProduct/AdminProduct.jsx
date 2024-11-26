import { Button, Form, Space, Select } from 'antd'
import { WrapperHeader, WrapperUploadFile } from './style'
import { AppstoreAddOutlined, DeleteOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import { useEffect, useRef, useState } from 'react'
import InputComponent from '../InputComponent/InputComponent'
import { error, success } from '../Message/Message'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import { renderOptions } from '../../utils.js'
function AdminProduct() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: ''
  })
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    discount: '',
    image: '',
    type: '',
    countInStock: ''
  })
  const [searchText, setSearchText] = useState('')
  // const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [typeSelect, setTypeSelect] = useState('')
  const user = useSelector((state) => state?.user)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const [form] = Form.useForm()

  const resetStateProduct = () => {
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: ''
    })
    form.resetFields()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    resetStateProduct()
  }
  const handleOnClick = () => {
    setIsModalOpen(true)
  }

  const handleOnOk = () => {
    if (
      stateProduct.name === '' ||
      stateProduct.price === '' ||
      stateProduct.countInStock === '' ||
      stateProduct.description === '' ||
      stateProduct.type === '' ||
      stateProduct.rating === '' ||
      stateProduct.discount === ''
    ) {
      error('Vui lòng nhập đủ thông tin trước khi lưu')
    } else {
      setIsModalOpen(false)
      onFinish()
      resetStateProduct()
    }
  }

  const mutation = useMutationHook((data) => {
    const { name, price, description, rating, image, type, countInStock, discount } = data
    const res = ProductService.createProduct({ name, price, description, rating, image, type, countInStock, discount })
    return res
  })

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = ProductService.updateProduct(id, token, rests.data)
    return res
  })
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
    const res = await ProductService.getAllProduct({ search: '', limit: 100 })
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

  const { data, isPending, isSuccess, isError } = mutation
  const {
    data: updatedData,
    isPending: isLoadingUpdate,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated
  } = mutationUpdate
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

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProduct
  })
  const typeProduct = useQuery({
    queryKey: ['type-product'],
    queryFn: fetchAllTypeProduct
  })

  const { isPending: isLoading, data: products } = queryProduct
  const fetchGetProductDetails = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount
      })
    }
    setIsPendingUpdate(false)
    // return res
  }

  useEffect(() => {
    form.setFieldsValue(stateProductDetails)
  }, [form, stateProductDetails])
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true)

      fetchGetProductDetails(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
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
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={handleDelete} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
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
      render: renderAction
    }
  ]
  const dataTable = products?.data.map((product) => {
    return { ...product, key: product._id }
  })

  useEffect(() => {
    if (isSuccessUpdated && updatedData?.status === 'OK') {
      success()
      handleOnCloseDrawer()
    } else if (isErrorUpdated) {
      error()
    }
  }, [isSuccessUpdated])

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
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount
    }
    mutation.mutate(params, {
      // onSettled: () => {
      //   queryProduct.refetch()
      // }
      onSuccess: () => {
        queryClient.invalidateQueries(['products']) // Làm mới dữ liệu bảng sản phẩm
      }
    })
    if (isSuccess && data?.status === 'OK') {
      success('Bạn đã thêm thành công sản phẩm')
      resetStateProduct()
    } else if (isError) {
      onFinishFailed()
    }
  }

  const onFinishFailed = () => {
    error('Bạn phải nhập đầy đủ thông tin sản phẩm')
  }

  const handleOnChange = (e) => {
    // setStateProduct({
    //   ...stateProduct,
    //   [e.target.name]: e.target.value
    // })
    form.setFieldsValue({ [e.target.name]: e.target.value }) // Cập nhật giá trị trong form
    setStateProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    console.log(stateProduct)
  }
  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setStateProduct({
          ...stateProduct,
          image: preview
        })
      },
      error(err) {
        console.error(err.message)
      }
    })
  }
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setStateProductDetails({
          ...stateProductDetails,
          image: preview
        })
      },
      error(err) {
        console.error(err.message)
      }
    })
  }

  const handleOnCloseDrawer = () => {
    setIsOpenDrawer(false)
    setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: ''
    })
    form.resetFields()
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, data: stateProductDetails },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['products']) // Làm mới dữ liệu bảng sản phẩm
        }
      }
    )
  }
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
    console.log(stateProduct)
  }

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
      <ModalComponent forceRender title="Tạo sản phẩm" onOk={handleOnOk} open={isModalOpen} onCancel={handleCancel}>
        <Loading isLoading={isPending}>
          <Form
            name="basic"
            labelCol={{
              span: 6
            }}
            wrapperCol={{
              span: 22
            }}
            style={{
              maxWidth: 600
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input product name!'
                }
              ]}
            >
              <InputComponent name="name" value={stateProduct.name} onChange={handleOnChange} />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Please input product type!'
                }
              ]}
            >
              <Select
                name={typeSelect !== 'add_type' ? 'type' : ''}
                // defaultValue="lucy"
                value={stateProduct.type}
                style={{ border: '2px solid #000', borderRadius: '6px' }}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>

            {stateProduct.type === 'add_type' && (
              <Form.Item
                label="New Type"
                name="newType"
                rules={[
                  {
                    required: true,
                    message: 'Please input product type!'
                  }
                ]}
              >
                <InputComponent value={stateProduct.newType} onChange={handleOnChange} name="newType" />
              </Form.Item>
            )}

            <Form.Item
              label="Count in stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Please input product countInStock!'
                }
              ]}
            >
              <InputComponent name="countInStock" value={stateProduct.countInStock} onChange={handleOnChange} />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please input product price!'
                }
              ]}
            >
              <InputComponent name="price" value={stateProduct.price} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input product description!'
                }
              ]}
            >
              <InputComponent name="description" value={stateProduct.description} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: 'Please input product rating!'
                }
              ]}
            >
              <InputComponent name="rating" value={stateProduct.rating} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: 'Please input product discount!'
                }
              ]}
            >
              <InputComponent name="discount" value={stateProduct.discount} onChange={handleOnChange} />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: 'Please input product image!'
                }
              ]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select file</Button>
                {stateProduct.image && (
                  <img
                    src={stateProduct.image}
                    style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <DrawerComponent title="Chi tiết sản phẩm" isOpen={isOpenDrawer} onClose={handleOnCloseDrawer} width="90%">
        <Loading isLoading={isPendingUpdate || isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 18
            }}
            style={{
              maxWidth: 600
            }}
            onFinish={onUpdateProduct}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input product name!'
                }
              ]}
            >
              <InputComponent name="name" value={stateProductDetails.name} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Please input product type!'
                }
              ]}
            >
              <InputComponent name="type" value={stateProductDetails.type} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item
              label="Count in stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Please input product countInStock!'
                }
              ]}
            >
              <InputComponent
                name="countInStock"
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please input product price!'
                }
              ]}
            >
              <InputComponent name="price" value={stateProductDetails.price} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input product description!'
                }
              ]}
            >
              <InputComponent
                name="description"
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: 'Please input product rating!'
                }
              ]}
            >
              <InputComponent name="rating" value={stateProductDetails.rating} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: 'Please input product discount!'
                }
              ]}
            >
              <InputComponent name="discount" value={stateProductDetails.discount} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: 'Please choose product image!'
                }
              ]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select file</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    alt="avatar"
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

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
