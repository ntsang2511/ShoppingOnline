import { Spin } from 'antd'

function Loading({ children, isLoading, deplay = 200 }) {
  return (
    <Spin spinning={isLoading} delay={deplay}>
      {children}
    </Spin>
  )
}

export default Loading
