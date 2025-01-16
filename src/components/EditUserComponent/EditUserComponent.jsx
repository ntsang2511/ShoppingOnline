import { Button, Form, Radio } from 'antd'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import { UploadOutlined } from '@ant-design/icons'
import { WrapperUploadFile } from './style'
import { useQueryClient } from '@tanstack/react-query'
import { error, success } from '../Message/Message'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
function EditUserComponent() {
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const user = useSelector((state) => state?.user)
  const location = useLocation()
  const rowSelected = location.pathname.split('/').pop()
  const queryClient = useQueryClient()
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: '',
    isShipper: false
  })
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = UserService.updateUser(id, rests.data, token)
    return res
  })
  const [form] = Form.useForm()
  const {
    data: updatedData,
    isPending: isLoadingUpdate,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated
  } = mutationUpdate

  useEffect(() => {
    if (isSuccessUpdated && updatedData?.status === 'OK') {
      success()
    } else if (isErrorUpdated) {
      error()
    }
  }, [isSuccessUpdated])
  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])
  const fetchGetUserDetails = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
        address: res?.data?.address,
        isShipper: res?.data?.isShipper || false
      })
    }
    setIsPendingUpdate(false)
    // return res
  }
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)

      fetchGetUserDetails(rowSelected)
    }
  }, [rowSelected])
  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, data: { ...stateUserDetails } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['users']) // Làm mới dữ liệu bảng sản phẩm
        }
      }
    )
  }
  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }, 500),
    [] // Delay 500ms
  )
  const onFinishFailedDetail = () => {
    error()
  }
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
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', color: 'red', fontSize: '1.7rem' }}>
        <h1>Chỉnh sửa thông tin người dùng</h1>
      </div>
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
            maxWidth: 1200
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
          <Form.Item label="Role" name="isShipper">
            <Radio.Group name="isShipper" onChange={handleOnChangeDetails} value={stateUserDetails.isShipper}>
              <Radio value={true}>Shipper</Radio>
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
                message: 'Please choose your avatar!'
              }
            ]}
          >
            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select file</Button>
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item label="Preview avatar">
            {stateUserDetails?.avatar && (
              <img
                src={stateUserDetails?.avatar}
                style={{
                  height: '200px',
                  width: '200px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                alt="avatar"
              />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 13,
              span: 16
            }}
          >
            <Button style={{ padding: '20px 100px' }} type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  )
}

export default EditUserComponent
