import { Row } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: #000;
  align-items: center;
  gap: 16px;
  height: 100px;
  flex-wrap: nowrap;
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

export const WrapperContentPopUp = styled.p`
  cursor: pointer;
  padding: 14px;
  margin: 0;
  &:hover {
    color: rgb(26, 148, 255);
  }
`
export const UserImage = styled.img`
  width: 100px;
  height: 100px;

  @media (max-width: 576px) {
    width: 100px;
  }

  @media (max-width: 768px) {
    width: 150px;
  }

  @media (min-width: 992px) {
    width: 200px;
  }
`
