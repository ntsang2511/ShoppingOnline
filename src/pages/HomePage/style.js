import styled from 'styled-components'

export const WrapperTypeProduct = styled.div`
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 16px 0;
  display: flex;
  justify-content: center;
  background-color: #1a1a1a;
`

export const WrapperProducts = styled.div`
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`

export const StickyHeader = styled.div`
  position: sticky;
  top: 102px;
  z-index: 900;
  background-color: #1a1a1a;
`
