import { Steps } from 'antd'

function StepComponent({ current = 0, items = [] }) {
  return <Steps current={current} items={items} />
}

export default StepComponent
