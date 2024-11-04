import { Checkbox, Rate } from 'antd'
import { WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'

function NavbarComponent() {
  const onChange = () => {}
  const renderContent = (type, options) => {
    switch (type) {
      case 'text':
        return options.map((opt) => {
          return <WrapperTextValue key={opt}>{opt}</WrapperTextValue>
        })
      case 'checkbox':
        return (
          <Checkbox.Group
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}
            onChange={onChange}
          >
            {options.map((opt) => {
              return (
                <Checkbox style={{ marginLeft: 0 }} value={opt.value} key={opt}>
                  {opt.label}
                </Checkbox>
              )
            })}
          </Checkbox.Group>
        )
      case 'star':
        return options.map((opt) => {
          return (
            <div key={opt} style={{ display: 'flex' }}>
              <Rate style={{ fontSize: '12px' }} disabled defaultValue={opt} />
              <span>Từ {opt} sao</span>
            </div>
          )
        })
      case 'price':
        return options.map((opt) => {
          return <WrapperTextPrice key={opt}>{opt}</WrapperTextPrice>
        })

      default:
        return {}
    }
  }
  return (
    <div>
      <WrapperLabelText>Label</WrapperLabelText>
      {renderContent('text', ['Tủ lạnh', 'TV', 'Máy giặt'])}
    </div>
  )
}

export default NavbarComponent
