import { Button, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Container, Dots, ButtonWrapper } from './style'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <Container>
      <Space size={8}>
        <ButtonWrapper isActive={false} disabled={currentPage === 1}>
          <Button
            size="small"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<LeftOutlined style={{ fontSize: '16px' }} />}
          />
        </ButtonWrapper>

        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <Dots>...</Dots>
            ) : (
              <ButtonWrapper isActive={currentPage === page}>
                <Button size="small" onClick={() => onPageChange(page)}>
                  {page}
                </Button>
              </ButtonWrapper>
            )}
          </div>
        ))}

        <ButtonWrapper isActive={false} disabled={currentPage === totalPages}>
          <Button
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<RightOutlined style={{ fontSize: '16px' }} />}
          />
        </ButtonWrapper>
      </Space>
    </Container>
  )
}

export default Pagination
