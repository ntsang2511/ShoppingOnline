import { WrapperInputStyle } from './style'

function InputForm({ placeholder = 'Nhập text', handleOnChange, value, ...rests }) {
  return (
    <WrapperInputStyle placeholder={placeholder} value={value} onChange={handleOnChange} {...rests}></WrapperInputStyle>
  )
}

export default InputForm
