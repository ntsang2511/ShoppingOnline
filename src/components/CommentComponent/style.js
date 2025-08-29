import { Card } from 'antd'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
  background-color: #1f1f1f;
  color: #fff5cc;
  border-color: #333333;
`

export const CardHeader = styled.div`
  padding: 16px;
`

export const CardTitle = styled.h3`
  color: #ffc107;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`

export const CardContent = styled.div`
  padding: 0 16px 16px;
  background-color: #1a1a1a;
`

export const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`

export const RatingValue = styled.span`
  font-size: 18px;
  font-weight: bold;
`

export const RatingCount = styled.span`
  color: #a69e80;
`

export const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const NewCommentSection = styled.div`
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  background-color: #292929;

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  }
`

export const RatingInput = styled.div`
  margin-bottom: 16px;

  label {
    font-size: 12px;
    color: #a69e80;
    margin-bottom: 8px;
    display: block;
  }
`

export const CommentInput = styled.div`
  margin-bottom: 16px;

  label {
    font-size: 12px;
    color: #a69e80;
    margin-bottom: 8px;
    display: block;
  }

  .ant-input {
    min-height: 100px;
    background-color: #1a1a1a;
    color: #fff5cc;
    border-color: #333333;
  }
`

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const CommentItem = styled.div`
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 16px;
  background-color: #292929;
  display: flex;
  gap: 12px;
`

export const AvatarContainer = styled.div`
  .ant-avatar {
    background-color: #ffc107;
    color: #1a1a1a;
    width: 40px;
    height: 40px;
  }
`

export const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const CommentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h4 {
    font-size: 16px;
    font-weight: bold;
    color: #fff5cc;
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      font-size: 12px;
      color: #a69e80;
    }
  }
`

export const FeedbackButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 8px;

  .ant-btn {
    color: #a69e80;
    padding: 0;

    &:hover {
      color: #fff5cc;
    }
  }
`

export const PaginationContainer = styled.div`
  margin-top: 16px;
  text-align: center;

  .ant-pagination {
    display: inline-flex;
  }

  .ant-pagination-item {
    background-color: #292929;
    border-color: #333333;
    color: #fff5cc;

    &.ant-pagination-item-active {
      background-color: #ffc107;
      color: #1a1a1a;
      border-color: #ffc107;
    }

    a {
      color: #fff5cc;
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    background-color: #292929;
    border-color: #333333;
    color: #fff5cc;

    &:hover {
      background-color: #ffc107;
      color: #1a1a1a;
    }
  }
`
export const StarContainerStyled = styled(StarContainer)`
  margin-bottom: 16px;
`
