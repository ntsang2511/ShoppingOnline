import { Image, InputNumber } from 'antd'
import styled from 'styled-components'

export const WrapperStyleImageSmall = styled(Image)`
  height: 100px;
  width: 100px;
`
export const WrapperStyleNameProduct = styled.h1`
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
  word-break: break-word;
`

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: #fff;
`
export const WrapperPriceProduct = styled.div`
  background: rgb(250, 250, 250);
  border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
  font-size: 32px;
  line-height: 40px;
  font-weight: 500;
  padding: 10px;
  background-color: #3a3a3a;
  color: #e01c1c;
`
export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: unrderline;
    text-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.change_address {
    color: rgb(11, 116, 229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    flex-shrink: 0;
  }
`
export const WrapperQuantityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid #ccc;
`

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    background-color: #333;

    width: 40px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
    .ant-input-number-input {
      color: #fff;
    }
  }
`
export const ReviewFormContainer = styled.section`
  margin: 20px auto;
  width: 100%;
  padding: 20px;
  border-top: 1px solid #ccc;
`
export const ReviewListContainer = styled.section`
  margin: 20px auto;
  marginbottom: 1000px;
  color: white;
  width: 80%;
`
export const ReviewItem = styled.li`
  display: flex;
  justify-content: space-between;
  width: 100%;
  list-style-type: none;
  background: white;
  margin-bottom: 10px;
  margin-left: 0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`
