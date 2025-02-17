import { Upload } from 'antd'
import styled from 'styled-components'

export const WrapperHeader = styled.h1`
  color: #ff424e;
  font-size: 2.5rem;
  margin: 0;
  padding-top: 10px;
`
export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  gap: 30px;
`
export const WrapperLabel = styled.label`
  color: #fff;
  font-size: 1.5rem;
  line-height: 30px;
  font-weight: 600;
  width: 60px;
  text-align: left;
`
export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`
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
