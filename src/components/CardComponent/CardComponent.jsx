import { useNavigate } from 'react-router-dom'
import { Button, Card, Tag } from 'antd'
import { StarFilled, StarOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { convertPrice } from '../../utils'
import { useDispatch, useSelector } from 'react-redux'
import { addOrderProduct } from '../../redux/slices/orderSlice'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as CartService from '../../services/CartService'
function CardComponent({
  productId,
  countInStock,
  name,
  image,
  price,
  rating,
  selled,
  discount,
  id,
  category,
  originalPrice
}) {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [hovered, setHovered] = useState(false)

  const getResponsiveWidth = () => {
    if (window.innerWidth <= 576) return '100%' // Almost full width on mobile
    if (window.innerWidth <= 768) return '45%' // Two cards per row on tablet
    if (window.innerWidth <= 1024) return '30%' // Three cards per row on small desktop
    return '23.5%' // Four cards per row on large desktop
  }

  const getResponsiveImgSize = () => {
    if (window.innerWidth <= 576) return 150
    if (window.innerWidth <= 768) return 200
    if (window.innerWidth <= 1024) return 250
    return 300
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

  const mutation = useMutationHook((data) => {
    const res = CartService.addItemCart(data)
    return res
  })
  const handleAddOrderProduct = (e) => {
    e.stopPropagation()
    if (!user?.id) {
      navigate('/sign-in', { state: location.pathname })
    } else {
      dispatch(
        addOrderProduct({
          orderItems: {
            name: name,
            amount: 1,
            image: image,
            price: price,
            product: productId,
            discount: discount,
            countInStock: countInStock
          }
        })
      )
      mutation.mutate({
        name: name,
        amount: 1,
        image: image,
        price: price,
        product: productId,
        discount: discount,
        countInStock: countInStock,
        userId: user?.id
      })
      navigate('/order')
    }
  }
  return (
    <Card
      hoverable={countInStock > 1}
      style={{
        width: cardWidth,
        backgroundColor: '#1C2024',
        borderColor: '#333A45',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: countInStock > 1 && hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: countInStock > 1 && hovered ? '0 8px 30px -5px #0B0D10' : 'none', // --shadow-card
        cursor: countInStock > 1 ? 'pointer' : 'not-allowed',
        opacity: countInStock > 1 ? 1 : 0.6
      }}
      onMouseEnter={() => countInStock > 1 && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => countInStock > 1 && handleDetailsProduct(id)}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          alt={name}
          src={image}
          style={{
            width: '100%',
            height: `${imgSize}px`,
            objectFit: 'cover',
            transition: 'transform 0.7s',
            transform: countInStock > 1 && hovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />

        {/* Badges */}
        {category && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            {category && (
              <Tag
                style={{
                  backgroundColor: '#272C33', // --secondary
                  color: '#FFE8A3', // --secondary-foreground
                  fontSize: '12px',
                  padding: '2px 8px',
                  border: 'none'
                }}
              >
                {category}
              </Tag>
            )}
          </div>
        )}

        {/* Hover Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            opacity: countInStock > 1 && hovered ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />

        {/* Add to Cart Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            opacity: countInStock > 1 && hovered ? 1 : 0,
            transform: countInStock > 1 && hovered ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.3s'
          }}
        >
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            style={{
              width: '100%',
              backgroundColor: '#FFC107', // --primary
              color: '#14171A', // --primary-foreground
              border: 'none',
              fontSize: '14px'
            }}
            onClick={handleAddOrderProduct}
            disabled={countInStock === 1}
          >
            <span style={{ display: 'inline', marginLeft: '8px' }}>Thêm vào giỏ</span>
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div style={{ padding: '10px' }}>
        {/* Name */}
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: countInStock > 1 ? '#FFE8A3' : '#8F9BB3', // --foreground or --muted-foreground
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            transition: 'color 0.3s',
            whiteSpace: 'nowrap'
          }}
          className={countInStock > 1 && hovered ? 'text-[#FFC107]' : ''}
        >
          {name}
        </h3>

        {/* Rating and Selled */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(rating) ? (
                  <StarFilled style={{ color: '#FFC107', fontSize: '12px' }} />
                ) : (
                  <StarOutlined style={{ color: '#8F9BB3', fontSize: '12px' }} />
                )}
              </span>
            ))}
            <span style={{ fontSize: '12px', color: countInStock > 1 ? '#8F9BB3' : '#8F9BB3', marginLeft: '4px' }}>
              {rating}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: countInStock > 1 ? '#8F9BB3' : '#8F9BB3' }}>
            | Đã bán {selled || 1000}+
          </span>
        </div>

        {/* Price and Discount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#DD0000' }}>{convertPrice(price)}</span>
          </div>
          {discount && (
            <div>
              <span style={{ fontSize: '13px', color: '#8F9BB3', textDecoration: 'line-through' }}>
                {convertPrice(originalPrice || price * (1 + discount / 100))}
              </span>
              <span style={{ marginLeft: '10px', fontSize: '12px', color: '#FF0000' }}>-{discount}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default CardComponent
