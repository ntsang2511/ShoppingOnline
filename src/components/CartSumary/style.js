import styled from 'styled-components'
import { Button, Card } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

export const CardStyled = styled(Card)`
  background-color: #221f1d;
  border: 1px solid #3b3330;
  padding: 16px;
  .ant-card-body {
    padding: 0;
  }
`

export const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

export const AddressIcon = styled(EnvironmentOutlined)`
  color: #ffc107;
  font-size: 16px;
  margin-right: 10px;
`

export const AddressText = styled.span`
  color: #ffe57f;
  font-weight: 500;
  font-size: 14px;
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

export const SummaryTitle = styled.h3`
  color: #ffe57f;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 16px;
`

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`

export const Label = styled.span`
  color: #c2b280;
`

export const Value = styled.span`
  color: #ffe57f;
`

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TotalLabel = styled.span`
  color: #ffe57f;
  font-weight: 600;
  font-size: 18px;
`

export const TotalContainer = styled.div`
  text-align: right;
`

export const TotalPrice = styled.div`
  color: #ffc107;
  font-weight: 700;
  font-size: 20px;
`

export const VatText = styled.div`
  color: #c2b280;
  font-size: 12px;
`

export const CheckoutButton = styled(Button)`
  width: 100%;
  background-color: #ffc107;
  color: #1c1a19;
  font-weight: 600;
  font-size: 16px;
  height: 48px;
  &:hover {
    background-color: #e6ae06 !important;
    color: #1c1a19 !important;
    border-color: #1c1a19 !important;
  }
`
