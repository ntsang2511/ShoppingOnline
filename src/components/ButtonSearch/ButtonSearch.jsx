import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
function ButtonSearch({
  size,
  placeholder,
  textButton,
  backgroundColorInput = 'fff',
  bakcgroundColorButton = '#FDA481',
  colorButton = '#fff',
  styleForButton,
  onClickButton,
  ...props
}) {
  return (
    <div style={{ display: 'flex' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{ backgroundColor: backgroundColorInput, borderRadius: 0 }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: bakcgroundColorButton,
          ...styleForButton
        }}
        onClick={onClickButton}
        styleTextButton={{ color: '#fff' }}
        icon={<SearchOutlined color={colorButton} style={{ color: '#fff' }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonSearch
