import { Button } from 'antd'
import styled from 'styled-components'

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`

export const StyledCard = styled.div`
  background-color: linear-gradient(135deg, #0f1017, #14141b);
  border: 1px solid rgba(38, 38, 46, 0.5);
  box-shadow: 0 4px 20px -2px rgba(10, 11, 16, 0.3);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 0.75rem;

  &:hover {
    box-shadow: 0 0 30px rgba(251, 193, 7, 0.15);
  }
`

export const StyledTitle = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`

export const StyledAddressContainer = styled.div`
  padding: 16px;
  background: rgba(38, 38, 46, 0.3);
  border: 1px solid rgba(38, 38, 46, 0.3);
  border-radius: 8px;
`

export const StyledText = styled.div`
  color: #fafafa;
  font-size: 14px;
  font-weight: 500;
`

export const StyledSpan = styled.span`
  color: #fbc107;
  font-weight: 600;
`

export const StyledItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`

export const StyledTotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`

export const StyledButton = styled(Button)`
  width: 90%;
  margin: 24px 0 10px 5%;

  background: linear-gradient(135deg, #fbc107, #e8a701);
  color: #0a0b10;
  font-weight: 600;
  padding: 24px 24px;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;

  &:hover {
    box-shadow: 0 0 30px rgba(251, 193, 7, 0.15) !important;
    background: linear-gradient(135deg, #fbc107, #e8a701) !important;
    color: #0a0b10 !important;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`
export const EditButton = styled(Button)`
  color: #ffc107;
  background: transparent;
  border: none;
  padding: 4px;
  &:hover {
    background-color: rgba(255, 193, 7, 0.1) !important;
    color: red !important;
  }
`
