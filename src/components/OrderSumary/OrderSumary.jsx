import { Divider, Typography } from 'antd'
import {
  StyledContainer,
  StyledAddressContainer,
  StyledText,
  StyledSpan,
  StyledItemContainer,
  StyledTotalContainer,
  StyledButton,
  EditButton,
  StyledTitle
} from './style'

import { EditOutlined, EnvironmentOutlined, ShoppingOutlined } from '@ant-design/icons'
const { Text } = Typography

export const OrderSummary = ({
  user,
  priceMemo,
  priceDiscountMemo,
  deliveryPriceMemo,
  totalPriceMemo,
  payment,
  handleChangeAddress,
  handleAddOrder,
  handleAddOrderWithZaloPay,
  convertPrice
}) => {
  return (
    <StyledContainer>
      <StyledAddressContainer>
        <div style={{ paddingBottom: 16 }}>
          <StyledTitle level={4}>
            <EnvironmentOutlined style={{ color: '#FBC107', fontSize: 20 }} />
            Địa chỉ giao hàng
          </StyledTitle>
        </div>
        <StyledText>
          Địa chỉ:{' '}
          <StyledSpan>
            {user?.address} {user?.city}
          </StyledSpan>
          <EditButton icon={<EditOutlined />} onClick={handleChangeAddress} />
        </StyledText>
      </StyledAddressContainer>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ paddingBottom: 16 }}>
            <StyledTitle level={4}>
              <ShoppingOutlined style={{ color: '#FBC107', fontSize: 20, marginLeft: '16px' }} />
              Đơn hàng của bạn
            </StyledTitle>
          </div>
          <StyledItemContainer>
            <StyledText>Tạm tính</StyledText>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{convertPrice(priceMemo)}</Text>
          </StyledItemContainer>
          <StyledItemContainer>
            <StyledText>Giảm giá</StyledText>
            <Text style={{ color: '#52c41a', fontSize: 14, fontWeight: 700 }}>-{convertPrice(priceDiscountMemo)}</Text>
          </StyledItemContainer>
          <StyledItemContainer>
            <StyledText>Phí giao hàng</StyledText>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{convertPrice(deliveryPriceMemo)}</Text>
          </StyledItemContainer>
        </div>

        <Divider style={{ backgroundColor: 'rgba(38, 38, 46, 0.5)', margin: '16px 0' }} />

        <StyledTotalContainer>
          <Text style={{ color: '#FAFAFA', fontSize: 20, fontWeight: 600 }}>Tổng tiền</Text>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text style={{ color: 'rgb(254,56,52)', fontSize: 24, fontWeight: 700 }}>
              {convertPrice(totalPriceMemo)}
            </Text>
            <Text style={{ color: '#fff', fontSize: 11 }}>(Đã bao gồm VAT nếu có)</Text>
          </div>
        </StyledTotalContainer>

        {payment === 'zalopayapp' ? (
          <StyledButton onClick={handleAddOrderWithZaloPay}>Thanh toán bằng ZaloPay</StyledButton>
        ) : (
          <StyledButton onClick={handleAddOrder}>Đặt hàng</StyledButton>
        )}
      </div>
    </StyledContainer>
  )
}
