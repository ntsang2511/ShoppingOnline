import { Button, Form, Radio, Space } from 'antd'
import { WrapperHeader } from './style'
import { DeleteOutlined, EditOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useCallback, useEffect, useRef, useState } from 'react'
import { error, success } from '../Message/Message'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useMutationHook } from '../../hooks/useMutationHook'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService'
import { debounce } from 'lodash'

function AdminUser() {
  const queryClient = useQueryClient()
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })
  const [searchText, setSearchText] = useState('')
  // const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const user = useSelector((state) => state?.user)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)

  const [form] = Form.useForm()

  const mutationUpdate = useMutationHook((data) => {
    console.log(data)
    const { id, token, ...rests } = data
    console.log(rests.data)
    const res = UserService.updateUser(id, rests.data, token)
    return res
  })
  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data
    const res = UserService.deleteUser(id, token)
    return res
  })

  const getAllUser = async () => {
    const res = await UserService.getAllUser()
    return res
  }
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
  const queryUser = useQuery({
    queryKey: ['user'],
    queryFn: getAllUser
  })
  const { isPending: isLoading, data: users } = queryUser
  const fetchGetUserDetails = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address
      })
    }
    setIsPendingUpdate(false)
    // return res
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)

      fetchGetUserDetails(rowSelected)
    }
  }, [rowSelected])

  const handleDetailsUser = () => {
    setIsOpenDrawer(true)
  }

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
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={handleDelete} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
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
      render: renderAction
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
    if (isSuccessUpdated && updatedData?.status === 'OK') {
      success()
      handleOnCloseDrawer()
    } else if (isErrorUpdated) {
      error()
    }
  }, [isSuccessUpdated])

  useEffect(() => {
    if (isSuccessDeleted && deletedData?.status === 'OK') {
      success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      error()
    }
  }, [isSuccessDeleted])

  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }, 500),
    [] // Delay 500ms
  )
  // (e) => {
  //   setStateUserDetails({
  //     ...stateUserDetails,
  //     [e.target.name]: e.target.value
  //   })
  // }
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setStateUserDetails({
          ...stateUserDetails,
          avatar: preview
        })
      },
      error(err) {
        console.error(err.message)
      }
    })
  }

  const handleOnCloseDrawer = () => {
    setIsOpenDrawer(false)
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
      avatar: '',
      address: ''
    })
    form.resetFields()
  }

  const onUpdateUser = () => {
    console.log(stateUserDetails)
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, data: { ...stateUserDetails } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['users']) // Làm mới dữ liệu bảng sản phẩm
        }
      }
    )
  }
  const onFinishFailedDetail = () => {
    error()
  }
  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: '20px' }}>
        <TableComponent
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

      <DrawerComponent title="Chi tiết người dùng" isOpen={isOpenDrawer} onClose={handleOnCloseDrawer} width="90%">
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
            onFinish={onUpdateUser}
            onFinishFailed={onFinishFailedDetail}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!'
                }
              ]}
            >
              <InputComponent name="name" value={stateUserDetails.name} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!'
                }
              ]}
            >
              <InputComponent name="email" value={stateUserDetails.email} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone!'
                }
              ]}
            >
              <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnChangeDetails} />
            </Form.Item>

            <Form.Item label="Role" name="isAdmin">
              <Radio.Group name="isAdmin" onChange={handleOnChangeDetails} value={stateUserDetails.isAdmin}>
                <Radio value={true}>Admin</Radio>
                <Radio value={false}>User</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please input your address!'
                }
              ]}
            >
              <InputComponent name="address" value={stateUserDetails.address} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: true,
                  message: 'Please input your avatar!'
                }
              ]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select file</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
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
