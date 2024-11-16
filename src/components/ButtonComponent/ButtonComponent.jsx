import { Button } from 'antd'
function ButtonComponent({ size, styleButton, styleTextButton, textButton, ...rest }) {
  return (
    <Button
      style={{
        ...styleButton
      }}
      size={size}
      // icon={<SearchOutlined color={colorButton} />}
      {...rest}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent
