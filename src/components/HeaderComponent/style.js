import { Row } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: rgb(26, 148, 255);
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
`

export const WrapperTextHeader = styled.a`
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  text-align: left;
  text-transform: uppercase;
  &:hover.css-dev-only-do-not-override-apn68: {
    color: #fff !important;
    background-color: #fff !important;
  }
`
export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`
export const WrapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #fff;
`
export const WrapperIconHeader = styled.span`
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
`
