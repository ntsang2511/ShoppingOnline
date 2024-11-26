import { useNavigate } from 'react-router-dom'
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperPriceDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell
} from './style'
import { StarFilled } from '@ant-design/icons'
import { convertPrice } from '../../utils'
function CardComponent({ countInStock, description, name, image, price, rating, type, selled, discount, id }) {
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
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
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
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
        {convertPrice(price)} <WrapperPriceDiscountText>-{discount || 5}%</WrapperPriceDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
