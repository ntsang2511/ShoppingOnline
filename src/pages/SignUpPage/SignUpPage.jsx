import { useState, useEffect } from 'react'
import { Button, Form, Card, Space, Typography } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { Watch } from 'lucide-react'
import Avatar from 'antd/es/avatar/avatar'
import { InputStyled } from './style'
const { Text } = Typography

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const mutation = useMutationHook((data) => UserService.signUpUser(data))
  const { data, isPending, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleSignUp = (values) => {
    mutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      phone: values.phone
    })
  }

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('btn-signup').click()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #262626 0%, #1F1F1F 50%, #1A1A1A 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 80,
          width: 128,
          height: 128,
          background: 'linear-gradient(to right, #FFC10733, transparent)',
          borderRadius: '50%',
          filter: 'blur(24px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 80,
          width: 160,
          height: 160,
          background: 'linear-gradient(to left, #FFC10733, transparent)',
          borderRadius: '50%',
          filter: 'blur(24px)'
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 448, padding: '0 24px' }}>
        <Card
          style={{
            backgroundColor: 'rgba(38, 38, 38, 0.9)',
            backdropFilter: 'blur(4px)',
            borderColor: '#404040',
            boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.5)',
            borderRadius: 8
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Space size={8} style={{ marginBottom: 16 }}>
              <Avatar
                style={{
                  background: '#FFC107',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #ccc'
                }}
                size={45}
                icon={<Watch size={30} style={{ color: '#331600' }} />}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    fontFamily: '"Playfair Display", serif',
                    color: '#fff',
                    height: '24px'
                  }}
                >
                  WATCH SHOP
                </Text>
                <Text style={{ fontSize: '12px', color: '#ccc', letterSpacing: '0.1em', fontWeight: '700' }}>
                  BEST SHOP EVER
                </Text>
              </div>
            </Space>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#FFC107', margin: '0 auto' }}>Xin chào</h2>
            <p style={{ color: '#BFB05C', margin: 0 }}>Đăng ký tài khoản cửa hàng đồng hồ</p>
          </div>

          <Loading isLoading={isPending}>
            <Form form={form} onFinish={handleSignUp} layout="vertical" style={{ padding: '0 24px' }}>
              <Form.Item
                label={<span style={{ color: '#FFC107' }}>Họ và tên</span>}
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <InputStyled
                  placeholder="Họ và tên"
                  onFocus={(e) => (e.target.style.borderColor = '#FFC107')}
                  onBlur={(e) => (e.target.style.borderColor = '#404040')}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#FFC107' }}>Số điện thoại</span>}
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <InputStyled
                  placeholder="Số điện thoại"
                  onFocus={(e) => (e.target.style.borderColor = '#FFC107')}
                  onBlur={(e) => (e.target.style.borderColor = '#404040')}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#FFC107' }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <InputStyled
                  placeholder="abc@gmail.com"
                  onFocus={(e) => (e.target.style.borderColor = '#FFC107')}
                  onBlur={(e) => (e.target.style.borderColor = '#404040')}
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#FFC107' }}>Mật khẩu</span>}
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <InputStyled
                  type={isShowPassword ? 'text' : 'password'}
                  style={{ padding: '4px 11px' }}
                  onFocus={(e) => (e.target.style.borderColor = '#FFC107')}
                  onBlur={(e) => (e.target.style.borderColor = '#404040')}
                  suffix={
                    <Button
                      type="text"
                      icon={
                        isShowPassword ? (
                          <EyeInvisibleOutlined style={{ color: '#BFB05C' }} />
                        ) : (
                          <EyeOutlined style={{ color: '#BFB05C' }} />
                        )
                      }
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      style={{ padding: 0 }}
                    />
                  }
                />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: '#FFC107' }}>Xác nhận mật khẩu</span>}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                    }
                  })
                ]}
                validateStatus={data?.status === 'ERR' ? 'error' : ''}
                help={
                  data?.status === 'ERR' ? (
                    <span style={{ color: '#F5222D', fontSize: '1.4rem' }}>{data?.message}</span>
                  ) : null
                }
              >
                <InputStyled
                  type={isShowConfirmPassword ? 'text' : 'password'}
                  style={{ padding: '4px 11px' }}
                  onFocus={(e) => (e.target.style.borderColor = '#FFC107')}
                  onBlur={(e) => (e.target.style.borderColor = '#404040')}
                  suffix={
                    <Button
                      type="text"
                      icon={
                        isShowConfirmPassword ? (
                          <EyeInvisibleOutlined style={{ color: '#BFB05C' }} />
                        ) : (
                          <EyeOutlined style={{ color: '#BFB05C' }} />
                        )
                      }
                      onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                      style={{ padding: 0 }}
                    />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  id="btn-signup"
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={
                    !form.getFieldValue('email') ||
                    !form.getFieldValue('password') ||
                    !form.getFieldValue('confirmPassword') ||
                    !form.getFieldValue('name') ||
                    !form.getFieldValue('phone')
                  }
                  style={{
                    background: 'linear-gradient(to right, #FFC107, #FFCA28)',
                    borderColor: 'transparent',
                    color: '#1A1A1A',
                    fontWeight: 600,
                    boxShadow: '0 10px 30px -10px rgba(255, 193, 7, 0.3)',
                    borderRadius: 6,
                    height: 48,
                    margin: '26px 0 10px'
                  }}
                  onMouseEnter={(e) => (e.target.style.background = 'linear-gradient(to right, #FFCA28, #FFC107)')}
                  onMouseLeave={(e) => (e.target.style.background = 'linear-gradient(to right, #FFC107, #FFCA28)')}
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16,
                    color: '#BFB05C',
                    fontSize: 14
                  }}
                >
                  <span style={{ marginRight: 4 }}>Bạn đã có tài khoản?</span>
                  <a
                    href="#"
                    style={{ color: '#FFC107', textDecoration: 'underline', fontWeight: 500 }}
                    onClick={handleNavigateSignIn}
                    onMouseEnter={(e) => (e.target.style.color = '#FFCA28')}
                    onMouseLeave={(e) => (e.target.style.color = '#FFC107')}
                  >
                    Đăng nhập
                  </a>
                </div>
              </div>
            </Form>
          </Loading>
        </Card>

        {/* Promotional banner */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'linear-gradient(to right, #FFC10733, #FFCA2833)',
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid #FFC1074D'
            }}
          >
            <Watch style={{ fontSize: 20, color: '#FFC107', marginRight: 8 }} className="animate-pulse" />
            <span style={{ color: '#FFC107', fontSize: 14, fontWeight: 500 }}>Giảm giá 50% cho đồng hồ cao cấp</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
