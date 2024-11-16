import { Image } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import slide2 from '../../assets/image/slide2.jpg'
import { useEffect, useState } from 'react'
import * as UserService from '../../services/UserService'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
function SignUpPage() {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const navigate = useNavigate()
  const onClickShowPassword = () => {
    setIsShowPassword((prev) => !prev)
  }

  const onClickShowConfirmPassword = () => {
    setIsShowConfirmPassword((prev) => !prev)
  }

  const handleOnChangeName = (e) => {
    setName(e.target.value)
  }
  const handleOnChangePhone = (e) => {
    setPhone(e.target.value)
  }

  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleOnChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleOnChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }
  const mutation = useMutationHook((data) => UserService.signUpUser(data))

  const { data, isPending, isSuccess, isError } = mutation
  useEffect(() => {
    if (isSuccess) {
      message.success()
      handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])
  const handleSignUp = () => {
    mutation.mutate({ name, email, password, confirmPassword, phone })
  }
  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }
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
            placeholder="Name"
            style={{ marginBottom: '10px' }}
            handleOnChange={handleOnChangeName}
            value={name}
          />
          <InputForm
            placeholder="Phone Number"
            style={{ marginBottom: '10px' }}
            handleOnChange={handleOnChangePhone}
            value={phone}
          />
          <InputForm
            placeholder="abc@gmail.com"
            style={{ marginBottom: '10px' }}
            handleOnChange={handleOnChangeEmail}
            value={email}
          />

          <div style={{ position: 'relative' }}>
            <span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px' }}>
              {isShowPassword ? (
                <EyeFilled onClick={onClickShowPassword} />
              ) : (
                <EyeInvisibleFilled onClick={onClickShowPassword} />
              )}
            </span>
            <InputForm
              handleOnChange={handleOnChangePassword}
              value={password}
              placeholder="password"
              style={{ marginBottom: '10px' }}
              type={isShowPassword ? 'text' : 'password'}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px' }}>
              {isShowPassword ? (
                <EyeFilled onClick={onClickShowConfirmPassword} />
              ) : (
                <EyeInvisibleFilled onClick={onClickShowConfirmPassword} />
              )}
            </span>
            <InputForm
              value={confirmPassword}
              handleOnChange={handleOnChangeConfirmPassword}
              placeholder="confirm password"
              type={isShowConfirmPassword ? 'text' : 'password'}
            />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email || !password || !confirmPassword || !name || !phone}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                backgroundColor: 'rgb(255,57,69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textButton="Đăng Ký"
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}
            />
          </Loading>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '5px' }}>Bạn đã có tài khoản</p>
            <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập</WrapperTextLight>
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

export default SignUpPage
