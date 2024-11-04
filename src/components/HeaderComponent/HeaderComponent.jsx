import { Badge, Col } from 'antd'
import { WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
// import Search from 'antd/es/transfer/search'
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import ButtonSearch from '../ButtonSearch/ButtonSearch'
function HeaderComponent() {
  return (
    <div>
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader href="/">anhsangvlog</WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButtonSearch backgroundColorInput="#fff" size="large" placeholder="Search here..." textButton="Tìm kiếm" />
        </Col>
        <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: '30px' }} />
            <div>
              <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Đăng nhập/đăng ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Tài khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
          <div>
            <div>
              <Badge count={4} size="small">
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
