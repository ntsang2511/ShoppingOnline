import { InputNumber } from 'antd'
import styled from 'styled-components'

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    background-color: #333;
    padding: 3px;
    width: 60px;
    border-top: none;
    text-align: center;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
    .ant-input-number-input {
      color: #fff5cc;
    }
  }
`

export const IconButton = styled.button`
  border: 1px solid #cccccc44;
  background-color: transparent;
  border-radius: 5px;
  padding: 3px 5px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ffc107;
    color: #1a1a1a;
  }

  svg {
    font-size: 20px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    color: #fff;
    border-color: #fff;
  }
`
