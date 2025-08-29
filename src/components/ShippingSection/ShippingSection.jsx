import { Radio } from 'antd'
import { CarOutlined, ThunderboltOutlined } from '@ant-design/icons'
import {
  StyledCard,
  StyledTitle,
  StyledRadioGroup,
  StyledOption,
  StyledIconContainer,
  StyledLabel,
  StyledText
} from './style'

export const ShippingSection = ({ delivery, handleDelivery }) => {
  return (
    <StyledCard>
      <div style={{ paddingBottom: 16 }}>
        <StyledTitle level={4}>
          <CarOutlined style={{ color: '#FBC107', fontSize: 20 }} />
          Chọn phương thức giao hàng
        </StyledTitle>
      </div>
      <div>
        <StyledRadioGroup onChange={handleDelivery} value={delivery}>
          <StyledOption>
            <Radio value="fast" id="fast" style={{ color: '#FBC107' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <StyledIconContainer isPrimary>
                <ThunderboltOutlined style={{ color: '#FBC107', fontSize: 20 }} />
              </StyledIconContainer>
              <div style={{ flex: 1 }}>
                <StyledLabel htmlFor="fast">FAST Giao hàng tiết kiệm</StyledLabel>
                <StyledText htmlFor="fast">Thời gian giao hàng dự kiến: 3-5 ngày</StyledText>
              </div>
            </div>
          </StyledOption>

          <StyledOption>
            <Radio value="gojek" id="gojek" style={{ color: '#FBC107' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <StyledIconContainer>
                <span style={{ color: '#2EB678', fontWeight: 'bold', fontSize: 14 }}>GO</span>
              </StyledIconContainer>
              <div style={{ flex: 1 }}>
                <StyledLabel htmlFor="gojek">GO-JEK Giao hàng tiết kiệm</StyledLabel>
                <StyledText htmlFor="gojek">Thời gian giao hàng dự kiến: 1-2 ngày</StyledText>
              </div>
            </div>
          </StyledOption>
        </StyledRadioGroup>
      </div>
    </StyledCard>
  )
}
