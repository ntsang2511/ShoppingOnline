import { Input } from 'antd'

function InputComponent({ size, placeholder, backgroundColorInput, ...rests }) {
  return (
    <Input
      size={size}
      style={{ backgroundColor: backgroundColorInput }}
      placeholder={placeholder}
      variant={false}
      {...rests}
    />
  )
}

export default InputComponent
