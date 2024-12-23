import { Image } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import slide2 from '../../assets/image/slide2.jpg'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slices/userSlice'

function SignInPage() {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const mutation = useMutationHook((data) => UserService.loginUser(data))
  const { data, isPending, isSuccess } = mutation

  useEffect(() => {
    if (data?.status === 'ERR') {
      message.error(data?.message)
      return
    }
    if (isSuccess && data?.status === 'OK') {
      if (location?.state) {
        navigate(location?.state)
      } else {
        navigate('/')
      }
      message.success('Sign in successfully')
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token)

        if (decoded.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  const onClick = () => {
    setIsShowPassword((prev) => !prev)
  }
  const navigate = useNavigate()
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleOnChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('btn-signin').click()
      }
    }

    // Gắn sự kiện khi component được mount
    document.addEventListener('keydown', handleKeyDown)

    // Xóa sự kiện khi component bị hủy
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.53)'
      }}
    >
      <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', backgroundColor: '#fff' }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            placeholder="abc@gmail.com"
            style={{ marginBottom: '10px' }}
            handleOnChange={handleOnChangeEmail}
            value={email}
          />
          <div style={{ position: 'relative' }}>
            <span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px' }}>
              {isShowPassword ? <EyeFilled onClick={onClick} /> : <EyeInvisibleFilled onClick={onClick} />}
            </span>
            <InputForm
              handleOnChange={handleOnChangePassword}
              value={password}
              placeholder="password"
              type={isShowPassword ? 'text' : 'password'}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red', fontSize: '1.4rem' }}>{data?.message}</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              id="btn-signin"
              onClick={handleSignIn}
              size={40}
              styleButton={{
                backgroundColor: 'rgb(255,57,69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textButton="Đăng nhập"
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}
            />
          </Loading>
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '5px' }}>Chưa có tài khoản</p>
            <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight>
          </div>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={slide2} preview={false} alt="image logo" width="203px" height="203px" />
          <h4>Mua sắp tại ANHSANGVLOG</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage
