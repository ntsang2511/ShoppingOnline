import { Image } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import slide2 from '../../assets/image/slide2.jpg'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useState } from 'react'
function SignInPage() {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const onClick = () => {
    setIsShowPassword((prev) => !prev)
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
          <InputForm placeholder="abc@gmail.com" style={{ marginBottom: '10px' }} />
          <div style={{ position: 'relative' }}>
            <span style={{ zIndex: 10, position: 'absolute', top: '4px', right: '8px' }}>
              {isShowPassword ? <EyeFilled onClick={onClick} /> : <EyeInvisibleFilled onClick={onClick} />}
            </span>
            <InputForm placeholder="password" type={isShowPassword ? 'text' : 'password'} />
          </div>
          <ButtonComponent
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
          <p>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
          </p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p style={{ marginRight: '5px' }}>Chưa có tài khoản</p>
            <WrapperTextLight>Tạo tài khoản</WrapperTextLight>
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
