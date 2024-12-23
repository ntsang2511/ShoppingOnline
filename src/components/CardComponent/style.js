import { Card } from 'antd'
import styled from 'styled-components'

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & img {
    height: 200px;
    width: 200px;
  }
  border: none;
  background-color: ${(props) => (props.disabled ? '#ccc' : '#000')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`

export const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => (props.disabled ? '#000' : '#fff')};
  font-weight: 400;
`

export const WrapperReportText = styled.div`
  font-size: 11px;
  color: ${(props) => (props.disabled ? '#000' : '#fff')};
  display: 'flex';
  align-items: center;
`
export const WrapperPriceText = styled.div`
  color: rgb(255, 66, 78);
  font-size: 16px;
  font-weight: 500;
  margin: 6px 0 0px;
`
export const WrapperPriceDiscountText = styled.span`
  color: rgb(255, 66, 78);
  font-size: 12px;
  font-weight: 500;
`
export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: ${(props) => (props.disabled ? '#000' : '#fff')};
`
