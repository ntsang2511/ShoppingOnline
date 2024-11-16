import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperPriceDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell
} from './style'
import { StarFilled } from '@ant-design/icons'
function CardComponent({ countInStock, description, name, image, price, rating, type, selled, discount }) {
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: '239px' }}
      styles={{
        header: {
          width: '200px',
          height: '200px'
        },
        body: {
          padding: '10px'
        }
      }}
      cover={
        <img
          alt="example"
          src="https://images.pexels.com/photos/364822/rolex-watch-time-luxury-364822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
      }
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell>| Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        {price}đ <WrapperPriceDiscountText>-{discount || 5}%</WrapperPriceDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
