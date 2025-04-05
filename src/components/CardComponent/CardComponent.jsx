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
import { useEffect, useState } from 'react'
function CardComponent({ countInStock, name, image, price, rating, selled, discount, id }) {
  const navigate = useNavigate()
  const getResponsiveWidth = () => {
    if (window.innerWidth <= 576) return 100
    if (window.innerWidth <= 768) return 150
    return 239
  }

  const getResponsiveImgSize = () => {
    if (window.innerWidth <= 576) return 100
    if (window.innerWidth <= 768) return 150
    return 200
  }
  const [cardWidth, setCardWidth] = useState(getResponsiveWidth())
  const [imgSize, setImgSize] = useState(getResponsiveImgSize())

  useEffect(() => {
    const handleResize = () => {
      setCardWidth(getResponsiveWidth())
      setImgSize(getResponsiveImgSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable={countInStock > 0}
      style={{ width: `${cardWidth}px` }}
      styles={{
        header: {
          width: `${imgSize}px`,
          height: `${imgSize}px`
        },
        body: {
          padding: '10px'
        }
      }}
      cover={<img alt="example" src={image} />}
      onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
      disabled={countInStock === 0}
    >
      <StyleNameProduct disabled={countInStock === 0}>{name}</StyleNameProduct>
      <WrapperReportText disabled={countInStock === 0}>
        <span style={{ marginRight: '4px' }}>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
        </span>
        <WrapperStyleTextSell disabled={countInStock === 0}>| Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        {convertPrice(price)} <WrapperPriceDiscountText>-{discount || 5}%</WrapperPriceDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
