import { Divider } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import {
  Wrapper,
  CardStyled,
  AddressHeader,
  AddressIcon,
  AddressText,
  EditButton,
  SummaryTitle,
  SummaryContainer,
  SummaryRow,
  Label,
  Value,
  TotalRow,
  TotalLabel,
  TotalContainer,
  TotalPrice,
  VatText,
  CheckoutButton
} from './style'

const CartSummary = ({ subtotal, discount, shipping, total, address, onClickBtnAddress, onClickBtnBuy }) => {
  return (
    <Wrapper>
      {/* Delivery Address */}
      <CardStyled>
        <AddressHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AddressIcon />
            <AddressText>Địa chỉ giao hàng</AddressText>
          </div>
          <EditButton icon={<EditOutlined />} onClick={onClickBtnAddress} />
        </AddressHeader>
        <p className="text-sm leading-relaxed" style={{ color: '#FFE57F' }}>
          {address}
        </p>
      </CardStyled>

      {/* Order Summary */}
      <CardStyled>
        <SummaryTitle>Tóm tắt đơn hàng</SummaryTitle>
        <SummaryContainer>
          <SummaryRow>
            <Label>Tạm tính</Label>
            <Value>{subtotal}</Value>
          </SummaryRow>
          <SummaryRow>
            <Label>Giảm giá</Label>
            <Value>{discount}</Value>
          </SummaryRow>
          <SummaryRow>
            <Label>Phí giao hàng</Label>
            <Value>{shipping}</Value>
          </SummaryRow>
          <Divider style={{ backgroundColor: '#3B3330' }} />
          <TotalRow>
            <TotalLabel>Tổng tiền</TotalLabel>
            <TotalContainer>
              <TotalPrice>{total}</TotalPrice>
              <VatText>(Đã bao gồm VAT nếu có)</VatText>
            </TotalContainer>
          </TotalRow>
        </SummaryContainer>
      </CardStyled>

      {/* Checkout Button */}
      <CheckoutButton onClick={() => onClickBtnBuy()}> Mua hàng </CheckoutButton>
    </Wrapper>
  )
}

export default CartSummary
