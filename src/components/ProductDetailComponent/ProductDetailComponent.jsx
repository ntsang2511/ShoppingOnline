import { Button, Col, Form, Image, Rate, Row, Select } from 'antd'
import {
  ReviewFormContainer,
  ReviewItem,
  ReviewListContainer,
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell
} from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slices/orderSlice'
import { convertPrice } from '../../utils'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import * as CartService from '../../services/CartService'
import * as ProductRatingService from '../../services/ProductRatingService'
import TextArea from 'antd/es/input/TextArea'
function ProductDetailComponent({ idProduct }) {
  console.log(idProduct)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [stateProductRating, setStateProductRating] = useState({
    user: user.name,
    name: '',
    rating: 0,
    comment: ''
  })
  const [numProduct, setNumProduct] = useState(1)

  const mutation = useMutationHook((data) => {
    const res = CartService.addItemCart(data)
    return res
  })
  const mutationProductRating = useMutationHook((data) => {
    const res = ProductRatingService.getProductRating(data)
    return res
  })
  const mutationCreateRating = useMutationHook((data) => {
    const res = ProductRatingService.createProductRating(data)
    return res
  })
  const mutationDeleteRating = useMutationHook((data) => {
    const res = ProductRatingService.deleteproductRating(data)
    return res
  })

  const mutationUpdateProduct = useMutationHook((data) => {
    const res = ProductService.updateProduct(data.id, user.access_token, data.data)
    return res
  })

  const onChange = (e) => {
    setNumProduct(Number(e.target.value))
  }
  const fetchGetProductDetails = async (context) => {
    console.log(context)
    const id = context?.queryKey && context?.queryKey[1]
    console.log(id)
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }
  console.log(idProduct)
  const {
    isPending,
    data: productDetails,
    isFetching
  } = useQuery({
    queryKey: ['products-details', idProduct],
    queryFn: fetchGetProductDetails,
    enabled: !!idProduct
  })

  const handleChangeCount = (type, countInStock) => {
    if (type === 'increase') {
      if (numProduct < countInStock) {
        setNumProduct(numProduct + 1)
      } else if (numProduct === countInStock) {
        return
      }
    } else {
      if (numProduct <= 1) {
        return
      } else {
        setNumProduct(numProduct - 1)
      }
    }
  }

  const { data, isPending: isPendingCart } = mutation
  const { data: dataProductRating, isPending: isPendingRating } = mutationProductRating
  const { data: dataCreateProductRating, isPending: isPendingCreateRating, isSuccess } = mutationCreateRating
  const { isPending: isPendingDelete, isSuccess: isSuccessDelete } = mutationDeleteRating
  useEffect(() => {
    if (productDetails?.name) {
      mutationProductRating.mutate(productDetails?.name, {
        onSuccess: (data) => {
          const count = Math.ceil(
            data.data.map((item) => item.rating).reduce((sum, current) => sum + current, 0) / data.data.length
          )
          if (productDetails?.rating !== count) {
            const { _id, ...data } = productDetails
            console.log(_id, productDetails)
            const newData = { ...data, rating: count }
            mutationUpdateProduct.mutate({ id: _id, data: newData })
          }
        }
      })
    }
  }, [productDetails, isSuccess, isSuccessDelete])

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location.pathname })
    } else {
      dispatch(
        addOrderProduct({
          orderItems: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock
          }
        })
      )
      mutation.mutate({
        name: productDetails?.name,
        amount: numProduct,
        image: productDetails?.image,
        price: productDetails?.price,
        product: productDetails?._id,
        discount: productDetails?.discount,
        countInStock: productDetails?.countInStock,
        userId: user?.id
      })
    }
  }

  const parseDescription = (text) => {
    // Tách đoạn văn bản dựa trên dấu `##`
    const lines = text?.split('\n')?.filter((line) => line.trim() !== '')
    return lines?.map((line, index) => {
      if (line?.startsWith('##')) {
        // Nếu dòng bắt đầu bằng `##`, trả về nội dung in đậm
        return (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', color: '#fff' }}>
            <h3 style={{ display: 'block', marginBottom: '8px' }}>{line.replace('##', '')}</h3>
          </div>
        )
      }
      // Các dòng khác sẽ là nội dung bình thường
      return (
        <p key={index} style={{ marginBottom: '8px', fontSize: '1.5rem', color: '#fff' }}>
          {line}
        </p>
      )
    })
  }
  const handleOnChange = (e) => {
    // setStateProduct({
    //   ...stateProduct,
    //   [e.target.name]: e.target.value
    // })
    form.setFieldsValue({ [e.target.name]: e.target.value }) // Cập nhật giá trị trong form
    setStateProductRating((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeRating = (value) => {
    setStateProductRating({
      ...stateProductRating,
      rating: value
    })
  }
  const renderStar = (rating) => {
    return (
      <div>
        {rating} <StarFilled style={{ color: 'yellow' }} />
      </div>
    )
  }
  const onFinish = () => {
    setStateProductRating((prevState) => {
      const updatedState = {
        ...prevState,
        name: productDetails?.name,
        user: user.name
      }
      mutationCreateRating.mutate(updatedState)
      return updatedState
    })
  }
  const handleDelete = (id) => {
    mutationDeleteRating.mutate(id)
  }
  const onFinishFailed = () => {}
  console.log(dataProductRating)
  return (
    <Loading isLoading={isPending || isFetching || isPendingDelete}>
      <Row style={{ padding: '16px', backgroundColor: '#333' }}>
        <Col span={10} style={{ paddingRight: '10px' }}>
          <Image src={productDetails?.image} alt="Image product" preview={true} />
        </Col>
        <Col span={14}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate
              disabled
              value={
                Math.ceil(
                  dataProductRating?.data?.map((item) => item.rating).reduce((sum, current) => sum + current, 0) /
                    dataProductRating?.data?.length
                ) || 0
              }
              style={{ fontSize: '12px', color: 'rgb(251,216,54)' }}
            />
            <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0}</WrapperStyleTextSell>
          </div>
          <div style={{ marginTop: '10px' }}>
            {productDetails?.countInStock === 0 || numProduct === productDetails?.countInStock ? (
              <span style={{ color: 'red' }}>Sản phẩm đã hết hàng</span>
            ) : (
              <span style={{ color: 'green' }}>Số lượng còn lại: {productDetails?.countInStock}</span>
            )}
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>

          <WrapperAddressProduct>
            <span style={{ color: '#fff' }}>Giao đến </span>
            <span className="address">{user.address}</span> -<span className="change_address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px' }}>
            <div style={{ marginBottom: '6px', color: '#fff' }}>Số lượng</div>
            <WrapperQuantityProduct>
              <button
                onClick={() => handleChangeCount('decrease', productDetails?.countInStock)}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <MinusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
              </button>
              <WrapperInputNumber onChange={onChange} min={1} value={numProduct} size="small" />
              <button
                onClick={() => handleChangeCount('increase', productDetails?.countInStock)}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <PlusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
              </button>
            </WrapperQuantityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ButtonComponent
              size={40}
              styleButton={{
                backgroundColor: 'rgb(255,57,69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton="Chọn mua"
              onClick={handleAddOrderProduct}
              disabled={productDetails?.countInStock === 0}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}
            />
            <ButtonComponent
              size={40}
              styleButton={{
                backgroundColor: 'transparent',
                height: '48px',
                width: '220px',
                border: '1px solid rgb(13, 92, 182)',
                borderRadius: '4px'
              }}
              textButton="Mua trả sau"
              styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
            />
          </div>
        </Col>
        <div style={{ padding: '16px', backgroundColor: '#333' }}>
          <div style={{ color: 'red', fontSize: '3rem' }}>Thông tin mô tả</div>
          {isPending || isFetching ? (
            <p style={{ fontSize: '2rem', color: '#999' }}>Đang tải thông tin mô tả...</p>
          ) : (
            parseDescription(productDetails?.description)
          )}
        </div>
        <ReviewFormContainer>
          <h2 style={{ color: 'white' }}>Đánh giá của bạn</h2>
          <Form
            name="basic"
            labelCol={{
              span: 4
            }}
            wrapperCol={{
              span: 22
            }}
            style={{
              maxWidth: 1200
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            form={form}
          >
            <Form.Item label={<span style={{ color: 'white' }}>Đánh giá chất lượng</span>} name="rating">
              <Select
                style={{
                  width: 120,
                  border: '2px solid #000',
                  borderRadius: '8px'
                }}
                name="rating"
                value={stateProductRating.rating}
                onChange={handleChangeRating}
                options={[
                  {
                    value: '1',
                    label: renderStar(1)
                  },
                  {
                    value: '2',
                    label: renderStar(2)
                  },
                  {
                    value: '3',
                    label: renderStar(3)
                  },
                  {
                    value: '4',
                    label: renderStar(4)
                  },
                  {
                    value: '5',
                    label: renderStar(5)
                  }
                ]}
              />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Bình luận</span>} name="comment">
              <TextArea
                name="comment"
                style={{ height: '200px', border: '2px solid #000' }}
                value={stateProductRating?.comment}
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 16
              }}
            >
              <Button
                style={{ padding: '20px', backgroundColor: 'rgb(255, 57, 69)', fontWeight: 'bold' }}
                type="primary"
                htmlType="submit"
              >
                Đăng
              </Button>
            </Form.Item>
          </Form>
        </ReviewFormContainer>
        <div style={{ width: '100%', borderTop: '1px solid #ccc' }}></div>
        <ReviewListContainer>
          <h2>Đánh giá của sản phẩm</h2>
          {dataProductRating?.data?.length > 0 ? (
            <ul>
              {dataProductRating?.data?.map((review, index) => {
                console.log(review.comment)
                return (
                  <ReviewItem key={index}>
                    <div>
                      <h3 style={{ color: '#333' }}>{review?.user}</h3>
                      <Rate style={{ fontSize: '1rem' }} disabled defaultValue={review?.rating} />
                      <p style={{ fontSize: '1.5rem', color: '#333' }}>{review?.comment}</p>
                    </div>
                    {user.name === review.user ? (
                      <DeleteOutlined
                        style={{ color: 'red', fontSize: '1.5rem', cursor: 'pointer' }}
                        onClick={() => handleDelete(review._id)}
                      />
                    ) : (
                      ''
                    )}
                  </ReviewItem>
                )
              })}
            </ul>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '2rem', color: 'red' }}>No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </ReviewListContainer>
      </Row>
    </Loading>
  )
}

export default ProductDetailComponent
