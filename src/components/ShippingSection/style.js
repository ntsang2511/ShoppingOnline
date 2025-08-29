import { Radio } from 'antd'
import styled from 'styled-components'

export const StyledCard = styled.div`
  background: linear-gradient(135deg, #0f1017, #14141b);
  border: 1px solid rgba(38, 38, 46, 0.5);
  box-shadow: 0 4px 20px -2px rgba(10, 11, 16, 0.3);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 0.75rem;

  &:hover {
    box-shadow: 0 0 30px rgba(251, 193, 7, 0.15);
  }
`

export const StyledTitle = styled.div`
  color: #fafafa;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const StyledOption = styled.div`
  border: 1px solid rgba(38, 38, 46, 0.5);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(251, 193, 7, 0.5);
    background-color: rgba(38, 38, 46, 0.3);
  }
`

export const StyledIconContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) => (props.isPrimary ? 'rgba(251, 193, 7, 0.1)' : 'rgba(46, 182, 120, 0.1)')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.isPrimary ? 'rgba(251, 193, 7, 0.2)' : 'rgba(46, 182, 120, 0.2)')};
  }
`

export const StyledLabel = styled.label`
  color: #fafafa;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: block;
`

export const StyledText = styled.label`
  color: #a1a1b0;
  font-size: 14px;
  margin-top: 4px;
  display: block;
`
