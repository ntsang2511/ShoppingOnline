import { useState } from 'react'
import { WrapperInputStyle } from './style'

function InputForm({ placeholder = 'Nhập text', ...rests }) {
  const [valueInput, setValueInput] = useState('')
  return <WrapperInputStyle placeholder={placeholder} value={valueInput} {...rests}></WrapperInputStyle>
}

export default InputForm
