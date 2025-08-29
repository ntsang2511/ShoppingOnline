import { Input } from 'antd'
import styled from 'styled-components'

export const CustomInput = styled(Input)`
  background-color: ${(props) => props.backgroundColorInput || '#1a1a1a'};
  color: ${(props) => (props.backgroundColorInput === '#fff' ? '#000' : '#fff')};

  &:hover {
    border-color: #ffc107;
  }

  &::placeholder {
    color: ${(props) => (props.backgroundColorInput === '#fff' ? '#000' : '#888')};
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
  }

  &:focus {
    border-color: #ffc107;
    box-shadow: none; /* bỏ viền glow của antd */
    background-color: ${(props) => props.backgroundColorInput || '#1a1a1a'};
    color: ${(props) => (props.backgroundColorInput === '#fff' ? '#000' : '#fff')};
    outline: none;

    &::placeholder {
      color: ${(props) => (props.backgroundColorInput === '#fff' ? '#000' : '#888')};
    }
  }
`
