import { Steps } from 'antd'
import styled from 'styled-components'

export const StyledSteps = styled(Steps)`
  .ant-steps-item-title {
    color: #ffe8a3 !important;
  }
  .ant-steps-item-description {
    color: #ffe8a3 !important;
  }
  .ant-steps-icon {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    border: 2px solid #ffe8a3 !important;
    color: #ffffff !important;
    background-color: transparent !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 32px !important;
  }
  .ant-steps-item-process .ant-steps-item-icon {
    background-color: #ffc107 !important;
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: transparent !important;
    border-color: transparent !important;
  }
  .ant-steps-item-finish .ant-steps-icon {
    border-color: #ffc107 !important;
  }
  .ant-steps-item-wait .ant-steps-icon {
    background-color: transparent !important;
  }
    /* Thêm xử lý để tránh tràn */
  .ant-steps {
    width: 100%;
    display: flex;
    flex-wrap: wrap; /* Cho phép xuống hàng */
    overflow: hidden; /* Ngăn tràn ra ngoài */
  }
`
