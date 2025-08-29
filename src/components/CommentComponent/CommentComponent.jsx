import { useEffect, useState } from 'react'
import {
  AvatarContainer,
  CardContent,
  CardHeader,
  CardTitle,
  CommentContent,
  CommentHeader,
  CommentInput,
  CommentItem,
  CommentsList,
  FeedbackButtons,
  NewCommentSection,
  PaginationContainer,
  RatingCount,
  RatingInput,
  RatingSummary,
  RatingValue,
  StarContainer,
  StyledCard
} from './style'
import { Avatar, Button, Form, Input, Pagination, message } from 'antd'
import { DeleteOutlined, DislikeOutlined, LikeOutlined, StarFilled } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as ProductRatingService from '../../services/ProductRatingService'
import ModalComponent from '../ModalComponent/ModalComponent'

export const CommentComponent = ({ dataProductRating, user, productName, onAverageRatingChange, onRatingsChange }) => {
  const [stateProductRating, setStateProductRating] = useState({
    user: user.id,
    name: '',
    rating: 0,
    comment: ''
  })
  const [newRating, setNewRating] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [localRatings, setLocalRatings] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState(null)
  const [userActions, setUserActions] = useState(new Set())
  const commentsPerPage = 3

  const mutationCreateRating = useMutationHook((data) => {
    const res = ProductRatingService.createProductRating(data)
    return res
  })
  const mutationDeleteRating = useMutationHook((data) => {
    const res = ProductRatingService.deleteproductRating(data)
    return res
  })
  const mutationEditRating = useMutationHook((data) => {
    const res = ProductRatingService.editProductRating(data)
    return res
  })

  const { isSuccess, data: mutationData, isError, error: createError } = mutationCreateRating
  const {
    isSuccess: isSuccessEdit,
    data: mutationEditData,
    isError: isErrorEdit,
    error: editError
  } = mutationEditRating
  const { isSuccess: isSuccessDelete } = mutationDeleteRating

  const getAllUser = async () => {
    const res = await UserService.getAllUser()
    return res
  }
  const [form] = Form.useForm()
  const queryUser = useQuery({
    queryKey: ['user'],
    queryFn: getAllUser
  })
  const { data: users } = queryUser

  // Đồng bộ localRatings và userActions với props dataProductRating
  useEffect(() => {
    const validRatings = (dataProductRating?.data || [])
      .filter((comment) => comment && comment._id && comment.user && comment.updatedAt)
      .map((comment) => ({
        ...comment,
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0,
        likedBy: comment.likedBy || [],
        dislikedBy: comment.dislikedBy || []
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    const newUserActions = new Set()
    validRatings.forEach((comment) => {
      if (comment.likedBy.includes(user.id)) {
        newUserActions.add(`like-${comment._id}`)
      }
      if (comment.dislikedBy.includes(user.id)) {
        newUserActions.add(`dislike-${comment._id}`)
      }
    })

    setLocalRatings(validRatings)
    setUserActions(newUserActions)
    if (onRatingsChange) {
      onRatingsChange(validRatings)
    }
  }, [dataProductRating, user.id, onRatingsChange])

  // Tính averageRating và truyền lên parent
  const averageRating = localRatings.reduce((sum, comment) => sum + comment.rating, 0) / localRatings.length || 0

  useEffect(() => {
    if (onAverageRatingChange) {
      onAverageRatingChange(averageRating)
    }
  }, [averageRating, onAverageRatingChange])

  // Đồng bộ giá trị rating ban đầu vào form
  useEffect(() => {
    form.setFieldsValue({ rating: newRating })
  }, [form, newRating])

  // Xử lý khi mutation create thành công
  useEffect(() => {
    if (isSuccess && mutationData) {
      if (mutationData.status === 'ERR') {
        message.error(mutationData.message || 'Không thể tạo đánh giá!')
        return
      }
      if (!mutationData?.data?._id || !mutationData?.data?.updatedAt) {
        console.error('Invalid mutationData:', mutationData)
        message.error('Không thể tạo đánh giá do dữ liệu không hợp lệ!')
        return
      }
      const newComment = {
        _id: mutationData.data._id,
        user: stateProductRating.user,
        rating: stateProductRating.rating,
        comment: stateProductRating.comment,
        updatedAt: mutationData.data.updatedAt,
        likes: mutationData.data.likes || 0,
        dislikes: mutationData.data.dislikes || 0,
        likedBy: mutationData.data.likedBy || [],
        dislikedBy: mutationData.data.dislikedBy || []
      }
      setLocalRatings((prev) => {
        const updatedRatings = [newComment, ...prev].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        if (onRatingsChange) {
          onRatingsChange(updatedRatings)
        }
        return updatedRatings
      })
      form.resetFields()
      setStateProductRating({
        user: user.id,
        name: '',
        rating: 5,
        comment: ''
      })
      setNewRating(5)
      setCurrentPage(1)
    }
    if (isError) {
      message.error(`Lỗi khi tạo đánh giá: ${createError?.message || 'Lỗi không xác định'}`)
    }
  }, [isSuccess, mutationData, isError, createError, onRatingsChange])

  // Xử lý khi mutation edit thành công
  useEffect(() => {
    if (isSuccessEdit && mutationEditData) {
      if (mutationEditData.status === 'ERR') {
        message.error(mutationEditData.message || 'Không thể chỉnh sửa đánh giá!')
        return
      }
      if (!mutationEditData?.data?._id || !mutationEditData?.data?.updatedAt) {
        console.error('Invalid mutationEditData:', mutationEditData)
        message.error('Không thể chỉnh sửa đánh giá do dữ liệu không hợp lệ!')
        return
      }
      setLocalRatings((prev) => {
        const updatedRatings = prev
          .map((comment) =>
            comment._id === mutationEditData.data._id
              ? {
                  ...comment,
                  likes: mutationEditData.data.likes || comment.likes,
                  dislikes: mutationEditData.data.dislikes || comment.dislikes,
                  updatedAt: mutationEditData.data.updatedAt,
                  likedBy: mutationEditData.data.likedBy || comment.likedBy,
                  dislikedBy: mutationEditData.data.dislikedBy || comment.dislikedBy
                }
              : comment
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        if (onRatingsChange) {
          onRatingsChange(updatedRatings)
        }
        return updatedRatings
      })
      setUserActions((prev) => {
        const newActions = new Set(prev)
        const likeKey = `like-${mutationEditData.data._id}`
        const dislikeKey = `dislike-${mutationEditData.data._id}`
        if (mutationEditData.data.likedBy.includes(user.id)) {
          newActions.add(likeKey)
          newActions.delete(dislikeKey)
        } else if (mutationEditData.data.dislikedBy.includes(user.id)) {
          newActions.add(dislikeKey)
          newActions.delete(likeKey)
        } else {
          newActions.delete(likeKey)
          newActions.delete(dislikeKey)
        }
        return newActions
      })
    }
    if (isErrorEdit) {
      message.error(`Lỗi khi chỉnh sửa đánh giá: ${editError?.message || 'Lỗi không xác định'}`)
    }
  }, [isSuccessEdit, mutationEditData, isErrorEdit, editError, onRatingsChange])

  // Xử lý khi mutation delete thành công
  useEffect(() => {
    if (isSuccessDelete) {
      setLocalRatings((prev) => {
        const updatedRatings = prev.filter((comment) => comment._id !== commentIdToDelete)
        if (onRatingsChange) {
          onRatingsChange(updatedRatings)
        }
        return updatedRatings
      })
      setUserActions((prev) => {
        const newActions = new Set(prev)
        newActions.delete(`like-${commentIdToDelete}`)
        newActions.delete(`dislike-${commentIdToDelete}`)
        return newActions
      })
      setIsModalVisible(false)
      setCommentIdToDelete(null)
      setCurrentPage(1)
    }
  }, [isSuccessDelete, commentIdToDelete, onRatingsChange])

  const renderStars = (rating, interactive = false, size = '16px', onChange) => {
    return (
      <StarContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarFilled
            key={star}
            style={{
              fontSize: '32px',
              width: size,
              height: size,
              color: star <= rating ? '#FFC107' : '#A69E80',
              cursor: interactive ? 'pointer' : 'default'
            }}
            onClick={interactive ? () => onChange(star) : undefined}
          />
        ))}
      </StarContainer>
    )
  }

  const totalPages = Math.ceil(localRatings.length / commentsPerPage)
  const startIndex = (currentPage - 1) * commentsPerPage
  const endIndex = startIndex + commentsPerPage
  const currentComments = [...localRatings]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(startIndex, endIndex)

  const getUserInfo = (userId) => {
    const user = users?.data?.find((u) => u?._id === userId)
    return {
      name: user?.name || 'Sang',
      image: user?.avatar
    }
  }

  const formatDate = (date) => {
    const dateFormat = new Date(date)
    return dateFormat.toLocaleDateString('vi-VN')
  }

  const onFinish = (values) => {
    const updatedState = {
      ...stateProductRating,
      name: productName,
      rating: values.rating || newRating,
      comment: values.comment || '',
      user: user.id,
      likes: 0,
      dislikes: 0
    }
    setStateProductRating(updatedState)
    mutationCreateRating.mutate(updatedState)
  }

  const onFinishFailed = () => {
    message.error('Vui lòng điền đầy đủ thông tin đánh giá!')
  }

  const handleOnChange = (e) => {
    form.setFieldsValue({ [e.target.name]: e.target.value })
    setStateProductRating((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLike = (comment) => {
    if (!comment._id) {
      console.error('Invalid comment ID:', comment)
      message.error('Không thể thích đánh giá này!')
      return
    }
    const actionKey = `like-${comment._id}`
    if (userActions.has(actionKey)) {
      message.warning('Bạn đã thích đánh giá này!')
      return
    }
    setUserActions((prev) => {
      const newActions = new Set(prev)
      newActions.add(actionKey)
      newActions.delete(`dislike-${comment._id}`)
      return newActions
    })
    setLocalRatings((prev) =>
      prev.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              likes: (c.likes || 0) + 1,
              dislikes: userActions.has(`dislike-${comment._id}`)
                ? Math.max(0, (c.dislikes || 0) - 1)
                : c.dislikes || 0,
              likedBy: [...(c.likedBy || []), user.id],
              dislikedBy: userActions.has(`dislike-${comment._id}`)
                ? (c.dislikedBy || []).filter((id) => id !== user.id)
                : c.dislikedBy || []
            }
          : c
      )
    )
    const updatedComment = {
      id: comment._id,
      name: productName,
      user: comment.user,
      rating: comment.rating,
      comment: comment.comment,
      likes: (comment.likes || 0) + 1,
      dislikes: userActions.has(`dislike-${comment._id}`)
        ? Math.max(0, (comment.dislikes || 0) - 1)
        : comment.dislikes || 0,
      likedBy: [...(comment.likedBy || []), user.id],
      dislikedBy: userActions.has(`dislike-${comment._id}`)
        ? (comment.dislikedBy || []).filter((id) => id !== user.id)
        : comment.dislikedBy || []
    }
    mutationEditRating.mutate(updatedComment)
  }

  const handleDislike = (comment) => {
    if (!comment._id) {
      console.error('Invalid comment ID:', comment)
      message.error('Không thể không thích đánh giá này!')
      return
    }
    const actionKey = `dislike-${comment._id}`
    if (userActions.has(actionKey)) {
      message.warning('Bạn đã không thích đánh giá này!')
      return
    }
    setUserActions((prev) => {
      const newActions = new Set(prev)
      newActions.add(actionKey)
      newActions.delete(`like-${comment._id}`)
      return newActions
    })
    setLocalRatings((prev) =>
      prev.map((c) =>
        c._id === comment._id
          ? {
              ...c,
              likes: userActions.has(`like-${comment._id}`) ? Math.max(0, (c.likes || 0) - 1) : c.likes || 0,
              dislikes: (c.dislikes || 0) + 1,
              likedBy: userActions.has(`like-${comment._id}`)
                ? (c.likedBy || []).filter((id) => id !== user.id)
                : c.likedBy || [],
              dislikedBy: [...(c.dislikedBy || []), user.id]
            }
          : c
      )
    )
    const updatedComment = {
      id: comment._id,
      name: productName,
      user: comment.user,
      rating: comment.rating,
      comment: comment.comment,
      likes: userActions.has(`like-${comment._id}`) ? Math.max(0, (comment.likes || 0) - 1) : comment.likes || 0,
      dislikes: (comment.dislikes || 0) + 1,
      likedBy: userActions.has(`like-${comment._id}`)
        ? (comment.likedBy || []).filter((id) => id !== user.id)
        : comment.likedBy || [],
      dislikedBy: [...(comment.dislikedBy || []), user.id]
    }
    mutationEditRating.mutate(updatedComment)
  }

  const handleDelete = (id) => {
    setCommentIdToDelete(id)
    setIsModalVisible(true)
  }

  const handleConfirmDelete = () => {
    mutationDeleteRating.mutate(commentIdToDelete)
    setIsModalVisible(false)
  }

  const handleCancelDelete = () => {
    setIsModalVisible(false)
    setCommentIdToDelete(null)
  }

  return (
    <StyledCard>
      <CardHeader>
        <CardTitle>Đánh giá sản phẩm</CardTitle>
        <RatingSummary>
          {renderStars(Math.round(averageRating))}
          <RatingValue>{averageRating.toFixed(1) || 0}</RatingValue>
          <RatingCount>({localRatings.length || 0} đánh giá)</RatingCount>
        </RatingSummary>
      </CardHeader>

      <CardContent>
        <NewCommentSection>
          <h4>Viết đánh giá của bạn</h4>
          <Form
            name="basic"
            style={{ maxWidth: 1200 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            form={form}
            className="custom-form"
          >
            <Form.Item
              name="rating"
              rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
              style={{ marginBottom: 16 }}
            >
              <RatingInput>
                {renderStars(newRating, true, '24px', (value) => {
                  setNewRating(value)
                  form.setFieldsValue({ rating: value })
                })}
              </RatingInput>
            </Form.Item>
            <Form.Item
              name="comment"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá!' }]}
              style={{ marginBottom: 16 }}
            >
              <CommentInput>
                <Input.TextArea
                  name="comment"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  value={stateProductRating?.comment}
                  onChange={handleOnChange}
                />
              </CommentInput>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: 'rgb(255, 57, 69)',
                  fontWeight: 'bold',
                  padding: '20px 43px'
                }}
              >
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>
        </NewCommentSection>

        <CommentsList>
          {currentComments?.map((comment) =>
            comment && comment._id ? (
              <CommentItem key={comment._id}>
                <AvatarContainer>
                  <Avatar src={getUserInfo(comment.user).image} alt={getUserInfo(comment.user).name}></Avatar>
                </AvatarContainer>
                <CommentContent>
                  <CommentHeader>
                    <h4 style={{ margin: '0' }}>{getUserInfo(comment.user).name}</h4>
                    <div>
                      {renderStars(comment.rating)}
                      <span style={{ fontSize: '14px' }}>{formatDate(comment.updatedAt)}</span>
                    </div>
                  </CommentHeader>
                  <p style={{ marginTop: '0' }}>{comment.comment}</p>
                  <FeedbackButtons>
                    <Button
                      type="text"
                      icon={<LikeOutlined />}
                      style={{
                        color: userActions.has(`like-${comment._id}`) ? '#FFC107' : '#595959',
                        backgroundColor: 'transparent'
                      }}
                      onClick={() => handleLike(comment)}
                    >
                      Hữu ích ({comment?.likes || 0})
                    </Button>
                    <Button
                      type="text"
                      icon={<DislikeOutlined />}
                      style={{
                        color: userActions.has(`dislike-${comment._id}`) ? '#FFC107' : '#595959',
                        backgroundColor: 'transparent'
                      }}
                      onClick={() => handleDislike(comment)}
                    >
                      Không hữu ích ({comment?.dislikes || 0})
                    </Button>
                  </FeedbackButtons>
                </CommentContent>
                {user.id === comment.user ? (
                  <DeleteOutlined
                    style={{ color: 'red', fontSize: '2rem', cursor: 'pointer' }}
                    onClick={() => handleDelete(comment._id)}
                  />
                ) : null}
              </CommentItem>
            ) : null
          )}
        </CommentsList>

        {totalPages > 1 && (
          <PaginationContainer>
            <Pagination
              current={currentPage}
              total={localRatings.length}
              pageSize={commentsPerPage}
              onChange={(page) => setCurrentPage(page)}
            />
          </PaginationContainer>
        )}
      </CardContent>
      <ModalComponent
        title="Xác nhận xóa"
        isOpen={isModalVisible}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
      </ModalComponent>
    </StyledCard>
  )
}
