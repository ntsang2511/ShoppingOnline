import { Col, Image, Row } from 'antd'
import anh1 from '../../assets/image/anh1.jpg'
import slide1 from '../../assets/image/slide1.jpg'
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell
} from './style'
import { MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
function ProductDetailComponent() {
  const onChange = () => {}
  return (
    <Row style={{ padding: '16px', backgroundColor: '#fff' }}>
      <Col span={10} style={{ paddingRight: '10px' }}>
        <Image src={anh1} alt="Image product" preview={false} />
        <Row style={{ paddingTop: '10px' }}>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
          <Col span={4}>
            <Image src={slide1} alt="Image small" preview={true} />
          </Col>
        </Row>
      </Col>
      <Col span={14}>
        <WrapperStyleNameProduct>Đồng hồ thông minh bằng kim loại</WrapperStyleNameProduct>
        <div>
          <StarFilled style={{ fontSize: '12px', color: 'rgb(251,216,54' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(251,216,54' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(251,216,54' }} />
          <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>200.000đ</WrapperPriceTextProduct>
        </WrapperPriceProduct>

        <WrapperAddressProduct>
          <span>Giao đến </span>
          <span className="address">Q. 1, P. Bến Nghế, Hồ Chí Minh</span> -
          <span className="change_address">Đổi địa chỉ</span>
        </WrapperAddressProduct>
        <div style={{ margin: '10px 0 20px' }}>
          <div style={{ marginBottom: '6px' }}>Số lượng</div>
          <WrapperQuantityProduct>
            <button style={{ border: 'none', backgroundColor: 'transparent' }}>
              <MinusOutlined style={{ fontSize: '20px' }} size="14px" />
            </button>
            <WrapperInputNumber min={1} max={10} defaultValue={3} onChange={onChange} size="small" />
            <button style={{ border: 'none', backgroundColor: 'transparent' }}>
              <PlusOutlined style={{ fontSize: '20px' }} size="14px" />
            </button>
          </WrapperQuantityProduct>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ButtonComponent
            size={40}
            styleButton={{
              backgroundColor: 'rgb(255,57,69)',
              height: '48px',
              width: '220px',
              border: 'none',
              borderRadius: '4px'
            }}
            textButton="Chọn mua"
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}
          />
          <ButtonComponent
            size={40}
            styleButton={{
              backgroundColor: 'transparent',
              height: '48px',
              width: '220px',
              border: '1px solid rgb(13, 92, 182)',
              borderRadius: '4px'
            }}
            textButton="Mua trả sau"
            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
          />
        </div>
      </Col>
    </Row>
  )
}

export default ProductDetailComponent
