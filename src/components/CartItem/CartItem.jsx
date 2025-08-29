import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

import {
  CardStyled,
  Container,
  CheckboxStyled,
  ImageContainer,
  ImageStyled,
  Info,
  Name,
  PriceContainer,
  Price,
  QuantityContainer,
  QuantityButton,
  Quantity,
  TotalPrice,
  RemoveButton,
  DiscountPrice
} from './style'

const CartItem = ({
  name,
  image,
  price,
  discountPrice,
  totalPrice,
  quantity,
  onQuantityChangeDecrease,
  onQuantityChangeIncrease,
  onRemove,
  onChange,
  isChecked,
  checkValue
}) => {
  return (
    <CardStyled>
      <Container>
        {/* Checkbox */}
        <CheckboxStyled checked={isChecked} onChange={onChange} value={checkValue} />

        {/* Product Image */}
        <ImageContainer>
          <ImageStyled src={image} alt={name} />
        </ImageContainer>

        {/* Product Info */}
        <Info>
          <Name>{name}</Name>
          <PriceContainer>
            <Price>{price}</Price>
            {discountPrice && <DiscountPrice>{discountPrice}</DiscountPrice>}
          </PriceContainer>
        </Info>

        {/* Quantity Controls */}
        <QuantityContainer>
          <QuantityButton icon={<MinusOutlined style={{ color: '#ffe57f' }} />} onClick={onQuantityChangeDecrease} />
          <Quantity>{quantity}</Quantity>
          <QuantityButton icon={<PlusOutlined style={{ color: '#ffe57f' }} />} onClick={onQuantityChangeIncrease} />
        </QuantityContainer>

        {/* Total Price */}
        <TotalPrice>
          <span>{totalPrice}</span>
        </TotalPrice>

        {/* Remove Button */}
        <RemoveButton icon={<DeleteOutlined />} onClick={onRemove} />
      </Container>
    </CardStyled>
  )
}

export default CartItem
