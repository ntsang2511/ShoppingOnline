import styled from 'styled-components'
import { Button, Checkbox } from 'antd'

export const WrapperContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    flex-direction: column;
    gap: 10px;
  }
`

export const WrapperLeft = styled.div`
  width: 840px;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 100%;
  }
`

export const WrapperListOrder = styled.div`
  width: 100%;
`

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background: #fff;
  margin-top: 12px;
`

export const WrapperRight = styled.div`
  width: 320px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 100%;
    margin-left: 0;
  }
`

export const WrapperOrderItem = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
`

export const WrapperStyleHeader = styled.div`
  background: #1a1a1a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
`

export const WrapperStyleHeaderDelivery = styled.div`
  background: #221f1d;
  border: 1px solid #3b3330;
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: #ffe8a3 !important;
    font-weight: 400;
    font-size: 13px;
  }
  margin-bottom: 4px;
`

export const ButtonDeleteAll = styled(Button)`
  background-color: #f5222d;
  border: none;
  & span {
    color: #ffffff !important;
  }
  &:hover {
    background-color: #c41d1d !important;
  }
`

export const CheckBoxAll = styled(Checkbox)`
  margin-right: 10px;
  color: black;

  .ant-checkbox-inner {
    border: 1px solid #3b3330;
  }

  /* Kiểu dáng khi checkbox được checked */
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #ffc107fd;
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
