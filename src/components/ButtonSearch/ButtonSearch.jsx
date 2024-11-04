import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
function ButtonSearch({
  size,
  placeholder,
  textButton,
  backgroundColorInput = 'fff',
  bakcgroundColorButton = 'rgb(13,92,182)',
  colorButton = '#fff'
}) {
  return (
    <div style={{ display: 'flex' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{ backgroundColor: backgroundColorInput, borderRadius: 0 }}
      />
      <ButtonComponent
        size={size}
        styleButton={{ background: bakcgroundColorButton, borderRadius: '0' }}
        icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonSearch
