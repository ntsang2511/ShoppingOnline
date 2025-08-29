import { StyledSteps } from './style'

function StepComponent({ current = 0, items = [] }) {
  return <StyledSteps current={current} items={items} />
}

export default StepComponent
