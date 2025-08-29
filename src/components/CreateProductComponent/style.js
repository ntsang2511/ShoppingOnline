import { Select, Upload } from 'antd'
import styled from 'styled-components'

export const WrapperUploadFile = styled(Upload)`
  & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  & .ant-upload-list.ant-upload-list-text {
    display: none;
  }
`
export const StyledSelect = styled(Select)`
  & .ant-select-selector {
    border: 2px solid #2e363f !important;
    border-radius: 6px !important;
    background: #252f33 !important;
    color: #fff !important;
  }

  & .ant-select-arrow {
    color: #fff !important;
  }

  & .ant-select-selection-item {
    color: #fff !important;
  }
`
