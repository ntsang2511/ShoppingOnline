import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #fafafa;
  margin-bottom: 8px;
  margin-top: 0;
`

export const Description = styled.p`
  color: #b3b3b3;
`

export const Highlight = styled.span`
  color: #ffc107;
  font-weight: 500;
`

export const SelectWrapper = styled.div`
  .ant-select {
    width: 192px;
  }
  .ant-select-selector {
    border-color: #fff;
  }
`
