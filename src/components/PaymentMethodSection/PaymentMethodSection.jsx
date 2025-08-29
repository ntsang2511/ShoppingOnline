import { Radio } from 'antd'
import { CreditCardOutlined, MobileOutlined } from '@ant-design/icons'
import {
  StyledCard,
  StyledTitle,
  StyledRadioGroup,
  StyledOption,
  StyledIconContainer,
  StyledLabel,
  StyledText
} from './style'

export const PaymentMethodSection = ({ payment, handlePayment }) => {
  return (
    <StyledCard>
      <div style={{ paddingBottom: 16 }}>
        <StyledTitle level={4}>
          <CreditCardOutlined style={{ color: '#FBC107', fontSize: 20 }} />
          Chọn phương thức thanh toán
        </StyledTitle>
      </div>
      <div>
        <StyledRadioGroup onChange={handlePayment} value={payment}>
          <StyledOption>
            <Radio value="later_money" id="later_money" style={{ color: '#FBC107' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <StyledIconContainer isPrimary>
                <CreditCardOutlined style={{ color: '#FBC107', fontSize: 20 }} />
              </StyledIconContainer>
              <div style={{ flex: 1 }}>
                <StyledLabel htmlFor="later_money">Thanh toán tiền mặt khi nhận hàng</StyledLabel>
                <StyledText htmlFor="later_money">Thanh toán trực tiếp cho shipper</StyledText>
              </div>
            </div>
          </StyledOption>

          <StyledOption>
            <Radio value="zalopayapp" id="zalopayapp" style={{ color: '#FBC107' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <StyledIconContainer>
                <MobileOutlined style={{ color: '#2C7CF1', fontSize: 20 }} />
              </StyledIconContainer>
              <div style={{ flex: 1 }}>
                <StyledLabel htmlFor="zalopayapp">Thanh toán bằng ZaloPay</StyledLabel>
                <StyledText htmlFor="zalopayapp">Thanh toán online qua ví điện tử</StyledText>
              </div>
            </div>
          </StyledOption>
        </StyledRadioGroup>
      </div>
    </StyledCard>
  )
}
