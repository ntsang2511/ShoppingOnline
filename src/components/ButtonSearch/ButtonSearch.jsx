import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
function ButtonSearch({
  size,
  placeholder,
  textButton,
  backgroundColorInput = '#fff',
  backgroundColorButton = '#FDA481',
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
        backgroundColorInput={backgroundColorInput}
        style={{ backgroundColor: backgroundColorInput, borderRadius: 0 }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          ...styleForButton
        }}
        hoverStyle={{
          backgroundColor: '#ffd350'
        }}
        onClick={onClickButton}
        styleTextButton={{ color: '#1a1a1a' }}
        icon={<SearchOutlined color={colorButton} style={{ color: '#1a1a1a' }} />}
        textButton={textButton}
      />
    </div>
  )
}

export default ButtonSearch
