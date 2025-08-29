import { Button } from 'antd'
import { useState } from 'react'
function ButtonComponent({ size, styleButton, styleTextButton, textButton, hoverStyle, ...rest }) {
  const [isHovered, setIsHovered] = useState(false)

  const buttonStyle = {
    ...styleButton,
    ...(isHovered && hoverStyle) // Áp dụng hoverStyle khi được hover
  }
  return (
    <Button
      style={buttonStyle}
      size={size}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // icon={<SearchOutlined color={colorButton} />}
      {...rest}
    >
      <span style={{ ...styleTextButton }}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent
