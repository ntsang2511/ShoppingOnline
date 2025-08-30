import { Input } from 'antd'
import styled from 'styled-components'

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;
`
export const WrapperContainerRight = styled.div`
  width: 300px;
  background-color: #fda481;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`
export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  cursor: pointer;
`

export const InputStyled = styled(Input)`
  background-color: #333333 !important;
  border-color: #404040 !important;
  color: #fff;
  border-radius: 6px;
  padding: 9px 11px;

  &::-webkit-input-placeholder {
    color: #ffffff7d !important;
  }

  &:focus,
  &:hover {
    border-color: #ffc107 !important;
    box-shadow: none !important;
  }
`
