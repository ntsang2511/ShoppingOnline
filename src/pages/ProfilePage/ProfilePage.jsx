import { useEffect, useState } from 'react'
import { Button, Input, Card, Avatar, Badge, notification, Row, Col, Upload } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  CheckOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { updateUser } from '../../redux/slices/userSlice'
import Loading from '../../components/LoadingComponent/Loading'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'

function ProfilePage() {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const dispatch = useDispatch()

  const mutation = useMutationHook(async (data) => {
    const { id, access_token, ...rests } = data
    const response = await UserService.updateUser(id, rests, access_token)
    return response
  })
  const { isPending, isSuccess, isError } = mutation

  useEffect(() => {
    setEmail(user?.email || '')
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setAddress(user?.address || '')
    setAvatar(user?.avatar || '')
  }, [user])

  useEffect(() => {
    if (isSuccess) {
      notification.success({
        message: 'Cập nhật thành công',
        description: 'Thông tin đã được cập nhật.'
      })
      handleGetDetailsUser(user?.id, user.access_token)
    } else if (isError) {
      notification.error({
        message: 'Cập nhật thất bại',
        description: 'Đã có lỗi xảy ra khi cập nhật thông tin.'
      })
    }
  }, [isSuccess, isError])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  const handleOnChangeEmail = (e) => {
    setTempValue(e.target.value)
  }

  const handleOnChangeName = (e) => {
    setTempValue(e.target.value)
  }

  const handleOnChangePhone = (e) => {
    setTempValue(e.target.value)
  }

  const handleOnChangeAddress = (e) => {
    setTempValue(e.target.value)
  }

  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (file) {
      new Compressor(file.originFileObj, {
        quality: 0.6,
        success: async (compressedFile) => {
          const preview = await getBase64(compressedFile)
          setAvatar(preview)
        },
        error(err) {
          console.error(err.message)
          notification.error({
            message: 'Lỗi tải ảnh',
            description: 'Không thể xử lý ảnh đã chọn.'
          })
        }
      })
    }
  }

  const handleEdit = (field, currentValue) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const handleUpdate = (field) => {
    console.log(tempValue)
    if (tempValue.trim()) {
      mutation.mutate({
        id: user?.id,
        email: field === 'email' ? tempValue : email,
        name: field === 'name' ? tempValue : name,
        phone: field === 'phone' ? tempValue : phone,
        address: field === 'address' ? tempValue : address,
        avatar,
        access_token: user?.access_token
      })
    }
    setEditingField(null)
    setTempValue('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setTempValue('')
  }

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Họ và tên',
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ'
    }
    return labels[field] || field
  }

  const getFieldIcon = (field) => {
    const icons = {
      name: <UserOutlined style={{ fontSize: '16px' }} />,
      email: <MailOutlined style={{ fontSize: '16px' }} />,
      phone: <PhoneOutlined style={{ fontSize: '16px' }} />,
      address: <EnvironmentOutlined style={{ fontSize: '16px' }} />
    }
    return icons[field]
  }

  const getFieldValue = (field) => {
    const values = {
      name,
      email,
      phone,
      address
    }
    return values[field] || ''
  }

  const ProfileField = ({ field, value, label }) => {
    const isEditing = editingField === field

    return (
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '8px',
            background: 'linear-gradient(145deg, #262C30, #22282B)',
            border: '1px solid #313A42',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.border = '1px solid #FFC10733')}
          onMouseLeave={(e) => (e.currentTarget.style.border = '1px solid #313A42')}
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#FFC10719',
                color: '#FFC107'
              }}
            >
              {getFieldIcon(field)}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', color: '#A2A9B0', display: 'block' }}>{label}</label>
              {isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Input
                    id={field}
                    value={tempValue}
                    onChange={(e) =>
                      field === 'email'
                        ? handleOnChangeEmail(e)
                        : field === 'name'
                          ? handleOnChangeName(e)
                          : field === 'phone'
                            ? handleOnChangePhone(e)
                            : handleOnChangeAddress(e)
                    }
                    style={{
                      background: '#1F252880',
                      borderColor: '#FFC1074D',
                      color: '#E8ECEF'
                    }}
                    autoFocus
                    onPressEnter={() => handleUpdate(field)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') handleCancel()
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    size="small"
                    onClick={() => handleUpdate(field)}
                    style={{
                      height: '32px',
                      padding: '0 20px',
                      color: '#1a1a1a',
                      background: '#FFC107'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffc107b9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFC107')}
                  />
                  <Button
                    size="small"
                    onClick={handleCancel}
                    style={{ height: '32px', padding: '0 12px', color: '#fff', background: 'transparent' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ffc107b9')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#fff')}
                  >
                    Hủy
                  </Button>
                </div>
              ) : (
                <p style={{ color: '#E8ECEF', fontWeight: 500, marginTop: '4px' }}>{value}</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleEdit(field, value)}
              style={{
                padding: '20px',
                transition: 'opacity 0.2s',
                position: 'absolute',
                color: '#1a1a1a',
                background: '#FFC107',
                fontWeight: '600',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              className="profile-field-button"
            >
              Cập nhật
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1F2528, #1C2225)',
        padding: '24px'
      }}
    >
      <Loading isLoading={isPending}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#E8ECEF' }}>Thông tin người dùng</h1>
            <p style={{ color: '#A2A9B0' }}>Quản lý và cập nhật thông tin cá nhân của bạn</p>
          </div>

          <Card
            style={{
              background: 'linear-gradient(145deg, #262C30, #22282B)',
              borderColor: '#313A42',
              boxShadow: '0 8px 32px rgba(16, 20, 23, 0.4)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ textAlign: 'center', paddingBottom: '24px' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar size={128} src={avatar} style={{ border: '4px solid #FFC10733' }}>
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Avatar>
                <Upload
                  listType="picture"
                  maxCount={1}
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleOnChangeAvatar}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<CameraOutlined />}
                    size="small"
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      right: '-8px',
                      height: '32px',
                      width: '32px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </Upload>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E8ECEF', marginTop: '16px' }}>{name}</h2>
              {user?.isAdmin ? (
                <Badge status="success" text="Thành viên VIP" style={{ marginTop: '8px', color: '#E8ECEF' }} />
              ) : (
                <Badge status="primary" text="Thành viên thường" style={{ marginTop: '8px', color: '#E8ECEF' }} />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ProfileField field="name" value={name} label="Họ và tên" />
              <ProfileField field="email" value={email} label="Địa chỉ email" />
              <ProfileField field="phone" value={phone} label="Số điện thoại" />
              <ProfileField field="address" value={address} label="Địa chỉ" />
            </div>
          </Card>
        </div>
      </Loading>
      <style>
        {`
          .profile-field-button:hover {
            opacity: 1 !important;
          }
          .ant-card:hover {
            box-shadow: 0 0 40px rgba(255, 193, 7, 0.15);
          }
        `}
      </style>
    </div>
  )
}

export default ProfilePage
