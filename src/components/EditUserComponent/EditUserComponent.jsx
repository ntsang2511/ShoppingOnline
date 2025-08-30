import { Button, Form, Radio, Avatar, Upload, Input } from 'antd'
import { CameraOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons'
import Loading from '../LoadingComponent/Loading'
import { useCallback, useEffect, useState } from 'react'
import { debounce } from 'lodash'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import { useQueryClient } from '@tanstack/react-query'
import { error, success } from '../Message/Message'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const EditUserComponent = () => {
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
          queryClient.invalidateQueries(['users'])
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
    []
  )

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (file) {
      new Compressor(file.originFileObj, {
        quality: 0.6,
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
  }

  return (
    <Loading isLoading={isPendingUpdate || isLoadingUpdate}>
      <div style={{ minHeight: '100vh', background: '#1A1A1A', padding: '24px' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <Form
            form={form}
            onFinish={onUpdateUser}
            onFinishFailed={() => error()}
            autoComplete="off"
            style={{ width: '100%' }}
          >
            <div
              style={{
                background: '#262626',
                borderColor: '#404040',
                color: '#FFCC00',
                padding: '24px',
                borderRadius: '8px'
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  color: '#FFCC00',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '32px'
                }}
              >
                Chỉnh sửa thông tin người dùng
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Avatar Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <Avatar
                      size={200}
                      src={stateUserDetails.avatar}
                      style={{
                        border: '2px solid #FFCC00',
                        background: '#333333',
                        color: '#FFCC00'
                      }}
                      icon={<UserOutlined />}
                    />
                    <Form.Item name="avatar" rules={[{ required: true, message: 'Please choose your avatar!' }]}>
                      <Upload showUploadList={false} beforeUpload={() => false} onChange={handleOnChangeAvatarDetails}>
                        <div
                          style={{
                            position: 'absolute',
                            top: -50,
                            right: 10,
                            fontSize: '20px',
                            background: '#FFCC00',
                            color: '#1A1A1A',
                            borderRadius: '100%',
                            padding: '12px 16px',
                            cursor: 'pointer'
                          }}
                        >
                          <CameraOutlined />
                        </div>
                        <Button
                          style={{
                            position: 'absolute',
                            background: '#333333',
                            color: '#FFCC00',
                            right: 30,
                            borderColor: '#404040'
                          }}
                        >
                          Chọn ảnh đại diện
                        </Button>
                      </Upload>
                    </Form.Item>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gap: '24px' }}>
                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>
                      Tên <span style={{ color: '#F44336' }}>*</span>
                    </label>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please input your name!' }]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        name="name"
                        value={stateUserDetails.name}
                        onChange={handleOnChangeDetails}
                        style={{ background: '#333333', borderColor: '#404040', color: '#FFCC00' }}
                      />
                    </Form.Item>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>
                      Email <span style={{ color: '#F44336' }}>*</span>
                    </label>
                    <Form.Item
                      name="email"
                      rules={[{ required: true, message: 'Please input your email!' }]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        type="email"
                        name="email"
                        value={stateUserDetails.email}
                        onChange={handleOnChangeDetails}
                        style={{ background: '#333333', borderColor: '#404040', color: '#FFCC00' }}
                      />
                    </Form.Item>
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>
                      Số điện thoại <span style={{ color: '#F44336' }}>*</span>
                    </label>
                    <Form.Item
                      name="phone"
                      rules={[{ required: true, message: 'Please input your phone!' }]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        name="phone"
                        value={stateUserDetails.phone}
                        onChange={handleOnChangeDetails}
                        style={{ background: '#333333', borderColor: '#404040', color: '#FFCC00' }}
                      />
                    </Form.Item>
                  </div>

                  {/* Role: isAdmin */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>Vai trò (Admin)</label>
                    <Form.Item name="isAdmin" style={{ margin: 0 }}>
                      <Radio.Group
                        name="isAdmin"
                        onChange={handleOnChangeDetails}
                        value={stateUserDetails.isAdmin}
                        style={{ display: 'flex', gap: '24px' }}
                      >
                        <Radio value={true} style={{ color: '#FFCC00' }}>
                          Admin
                        </Radio>
                        <Radio value={false} style={{ color: '#FFCC00' }}>
                          User
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  {/* Role: isShipper */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>Vai trò (Shipper)</label>
                    <Form.Item name="isShipper" style={{ margin: 0 }}>
                      <Radio.Group
                        name="isShipper"
                        onChange={handleOnChangeDetails}
                        value={stateUserDetails.isShipper}
                        style={{ display: 'flex', gap: '24px' }}
                      >
                        <Radio value={true} style={{ color: '#FFCC00' }}>
                          Shipper
                        </Radio>
                        <Radio value={false} style={{ color: '#FFCC00' }}>
                          User
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  {/* Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#FFCC00', fontWeight: 500 }}>
                      Địa chỉ <span style={{ color: '#F44336' }}>*</span>
                    </label>
                    <Form.Item
                      name="address"
                      rules={[{ required: true, message: 'Please input your address!' }]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        name="address"
                        value={stateUserDetails.address}
                        onChange={handleOnChangeDetails}
                        style={{ background: '#333333', borderColor: '#404040', color: '#FFCC00' }}
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Save Button */}
                <div style={{ paddingTop: '24px' }}>
                  <Button
                    type="primary"
                    block
                    htmlType="submit"
                    style={{ background: '#FFCC00', color: '#1A1A1A', fontWeight: 500, padding: '24px' }}
                  >
                    <SaveOutlined />
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </Loading>
  )
}

export default EditUserComponent
