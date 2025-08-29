import { CustomInput } from './style'

function InputComponent({ size, placeholder, backgroundColorInput, ...rests }) {
  return (
    <CustomInput
      size={size}
      backgroundColorInput={backgroundColorInput}
      placeholder={placeholder}
      variant={false}
      {...rests}
    />
  )
}

export default InputComponent
