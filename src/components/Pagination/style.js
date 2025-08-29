import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Matches space-x-2 */
  margin-top: 32px; /* Matches mt-8 */
`

export const Dots = styled.span`
  padding: 8px 12px; /* Matches px-3 py-2 */
  color: #b3b3b3; /* --muted-foreground: hsl(0 0% 70%) */
`

export const ButtonWrapper = styled.div`
  .ant-btn {
    border: 1px solid #404040; /* --border: hsl(0 0% 25%) */
    background: ${(props) => (props.isActive ? 'linear-gradient(135deg, #FFC107, #FFD54F)' : 'transparent')};
    color: ${(props) => (props.isActive ? '#1A1A1A' : '#FAFAFA')};
    height: 32px; /* Matches size="sm" */
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #ffc107 !important;
      background-color: #ffc107 !important;
      color: #1a1a1a !important;
    }

    &:disabled {
      border-color: #404040;
      background: transparent;
      color: #b3b3b3;
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`
