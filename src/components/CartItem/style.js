import styled from 'styled-components'
import { Button, Checkbox } from 'antd'
export const CardStyled = styled.div`
  background-color: #221f1d;
  width: 100%;
  border: 1px solid #3b3330;
  padding: 16px;
  border-radius: 15px;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const CheckboxStyled = styled(Checkbox)`
  .ant-checkbox-inner {
    border: 1px solid #3b3330;
  }
  /* Kiểu dáng khi checkbox được checked */
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ffc107;
    border-color: #ffc107;
  }

  /* Đặt màu trắng cho dấu check */
  .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: white !important;
    background-color: transparent !important; /* Loại bỏ background mặc định của dấu check */
  }

  /* Hiệu ứng hover khi chưa checked */
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner,
  .ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
    background-color: #ffc107 !important;
    border-color: #ffc107 !important;
  }

  /* Hiệu ứng hover khi đã checked */
  .ant-checkbox-wrapper:not(.ant-checkbox-wrapper-disabled):hover
    .ant-checkbox-checked:not(.ant-checkbox-disabled)
    .ant-checkbox-inner,
  .ant-checkbox-wrapper-checked:not(.ant-checkbox-wrapper-disabled):hover .ant-checkbox-inner,
  .ant-checkbox-checked:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
    background-color: #ffc107dd !important;
    border-color: #ffc107dd !important;
  }
`

export const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  background-color: #1c1a19;
  border-radius: 8px;
  flex-shrink: 0;
  overflow: hidden;
`

export const ImageStyled = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const Info = styled.div`
  flex: 1;
  min-width: 0;
`

export const Name = styled.h3`
  color: #ffe8a3;
  font-weight: 700;
  font-size: 16px;
  margin-top: 6px;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`

export const Price = styled.span`
  color: #ffc107 !important;
  font-weight: 600;
`

export const DiscountPrice = styled.span`
  color: #c2b280 !important;
  font-size: 12px;
  text-decoration: line-through;
`

export const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const QuantityButton = styled(Button)`
  width: 32px;
  height: 32px;
  background-color: #1c1a19;
  border: 1px solid #3b3330;
  color: #ffe57f !important;
  &:hover {
    background-color: #2c2825 !important;
    border: 1px solid #ffe57f !important;
  }
`

export const Quantity = styled.span`
  width: 32px;
  text-align: center;
  color: #ffe57f !important;
  font-weight: 500;
`

export const TotalPrice = styled.div`
  text-align: right;
  min-width: 100px;

  & span {
    color: #ffc107 !important;
    display: flex;
    font-weight: 700;
    font-size: 18px;
  }
`

export const RemoveButton = styled(Button)`
  color: #f5222d;
  background: transparent;
  border: none;
  & .anticon {
    color: #f5222d;
  }
  &:hover {
    background-color: #f5222d19 !important;
    & .anticon {
      color: #f5222d;
    }
  }
  &:hover,
  &:focus {
    border: none !important;
    background-color: #f5222d19 !important;
  }
`
