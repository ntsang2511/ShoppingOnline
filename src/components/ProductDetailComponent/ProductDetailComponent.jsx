import { Button, Card, Col, Form, Image, Row } from 'antd'
import { IconButton, WrapperInputNumber } from './style'
import { CreditCardOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons'
import { updateUser } from '../../redux/slices/userSlice'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slices/orderSlice'
import { convertPrice } from '../../utils'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import * as CartService from '../../services/CartService'
import * as ProductRatingService from '../../services/ProductRatingService'
import * as UserService from '../../services/UserService'
import ModalComponent from '../ModalComponent/ModalComponent'
import InputComponent from '../InputComponent/InputComponent'
import { debounce } from 'lodash'
import { CommentComponent } from '../CommentComponent/CommentComponent'

function ProductDetailComponent({ idProduct }) {
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [averageRating, setAverageRating] = useState(0)
  const [ratings, setRatings] = useState([]) // State để lưu danh sách đánh giá
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [numProduct, setNumProduct] = useState(1)
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })
  const mutation = useMutationHook((data) => {
    const res = CartService.addItemCart(data)
    return res
  })
  const mutationProductRating = useMutationHook((data) => {
    const res = ProductRatingService.getProductRating(data)
    return res
  })

  const mutationUpdateProduct = useMutationHook((data) => {
    const res = ProductService.updateProduct(data.id, user.access_token, data.data)
    return res
  })
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = UserService.updateUser(id, rests.data, token)
    return res
  })

  const onChange = (e) => {
    setNumProduct(Number(e.target.value))
  }
  const fetchGetProductDetails = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }
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

  const { data: dataProductRating } = mutationProductRating
  const { isPending: isLoadingUpdate } = mutationUpdate

  // Cập nhật rating của sản phẩm khi danh sách đánh giá thay đổi
  useEffect(() => {
    if (productDetails?._id && ratings.length > 0) {
      const count = Math.ceil(ratings.reduce((sum, comment) => sum + comment.rating, 0) / ratings.length) || 0
      if (productDetails.rating !== count) {
        const { _id, ...data } = productDetails
        const newData = { ...data, rating: count }
        mutationUpdateProduct.mutate({ id: _id, data: newData })
      }
    }
  }, [ratings, productDetails, mutationUpdateProduct])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        name: user?.name,
        city: user?.city,
        phone: user?.phone,
        address: user?.address
      })
    }
  }, [isOpenModalUpdateInfo])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

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

  const parseDescription = (html) => {
    if (!html) return null

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          color: '#A69E80'
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }, 500),
    []
  )
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, data: { ...stateUserDetails } },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }))
            setIsOpenModalUpdateInfo(false)
            window.location.reload()
          }
        }
      )
    }
  }
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone: '',
      address: '',
      city: ''
    })
    setIsOpenModalUpdateInfo(false)
  }

  const fetchAllComment = async (name, page, limit) => {
    mutationProductRating.mutate(
      { name, page, limit },
      {
        onSuccess: (data) => {
          if (data?.status === 'OK') {
            setPaginate((prev) => ({ ...prev, total: data?.totalPage }))
          }
        }
      }
    )
  }
  useEffect(() => {
    fetchAllComment(productDetails?.name, paginate.page, paginate.limit)
  }, [paginate.page, productDetails?.name])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  // Hàm renderStars cho ProductDetailComponent
  const renderStars = (rating, interactive = false, size = '16px') => (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarFilled
          key={star}
          style={{
            fontSize: size,
            width: size,
            height: size,
            color: star <= rating ? '#FFC107' : '#A69E80',
            cursor: interactive ? 'pointer' : 'default'
          }}
        />
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A1A', color: '#FFF5CC' }}>
      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 0' }}>
        <Row gutter={[32, 32]}>
          {/* Product Image */}
          <Col xs={24} lg={12}>
            <Card
              style={{ backgroundColor: '#1F1F1F', color: '#FFF5CC', overflow: 'hidden' }}
              bodyStyle={{ padding: 0, position: 'relative', height: '500px' }}
            >
              <Image
                src={productDetails?.image}
                alt="Casio Watch"
                preview={true}
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFF5CC', marginBottom: '8px' }}>
                  {productDetails?.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {renderStars(Math.round(averageRating), false, '16px')}
                  <span style={{ fontSize: '14px', color: '#A69E80' }}>| Đã bán {productDetails?.selled || 0}</span>
                </div>
                {productDetails?.countInStock === 0 || numProduct === productDetails?.countInStock ? (
                  <span style={{ color: 'red' }}>Sản phẩm đã hết hàng</span>
                ) : (
                  <p style={{ fontSize: '14px', color: '#FFC107', marginBottom: '16px' }}>
                    Số lượng còn lại: {productDetails?.countInStock}
                  </p>
                )}

                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5222D', marginBottom: '24px' }}>
                  {convertPrice(productDetails?.price)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                  <span style={{ color: '#A69E80' }}>Giao đến</span>
                  <span style={{ color: '#40C4FF' }}>
                    {user.address} -{' '}
                    <span onClick={handleChangeAddress} className="change_address" style={{ cursor: 'pointer' }}>
                      Đổi địa chỉ
                    </span>
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '14px', color: '#A69E80' }}>Số lượng</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconButton
                      onClick={() => handleChangeCount('decrease', productDetails?.countInStock)}
                      disabled={numProduct === 1}
                    >
                      <MinusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
                    </IconButton>
                    <WrapperInputNumber onChange={onChange} min={1} value={numProduct} size="small" />
                    <IconButton onClick={() => handleChangeCount('increase', productDetails?.countInStock)}>
                      <PlusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
                    </IconButton>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                  <Button
                    type="primary"
                    danger
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddOrderProduct}
                    disabled={productDetails?.countInStock === 0}
                    style={{ flex: 1, backgroundColor: '#F5222D', color: '#FFF5CC' }}
                    size="large"
                  >
                    Chọn mua
                  </Button>
                  <Button
                    style={{ flex: 1, borderColor: '#40C4FF', color: '#40C4FF' }}
                    icon={<CreditCardOutlined />}
                    size="large"
                  >
                    Mua trả sau
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Description Section */}
        <Card style={{ marginTop: '32px', backgroundColor: '#1F1F1F', color: '#FFF5CC' }}>
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107', marginBottom: '16px' }}>
              Thông tin mô tả
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#A69E80' }}>
              {isPending || isFetching ? (
                <p style={{ fontSize: '2rem', color: '#000' }}>Đang tải thông tin mô tả...</p>
              ) : (
                parseDescription(productDetails?.description)
              )}
            </div>
          </div>
        </Card>
      </main>

      <CommentComponent
        dataProductRating={dataProductRating}
        user={user}
        productName={productDetails?.name}
        onAverageRatingChange={setAverageRating}
        onRatingsChange={setRatings}
      />
      <ModalComponent
        title="Cập nhập thông tin giao hàng"
        onOk={handleUpdateInfoUser}
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
      >
        <Loading isLoading={isLoadingUpdate}>
          <Form
            name="basic"
            labelCol={{
              span: 8
            }}
            wrapperCol={{
              span: 18
            }}
            style={{
              maxWidth: 1200
            }}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!'
                }
              ]}
            >
              <InputComponent name="name" value={stateUserDetails.name} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                  message: 'Please input your city!'
                }
              ]}
            >
              <InputComponent name="city" value={stateUserDetails.city} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone!'
                }
              ]}
            >
              <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnChangeDetails} />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: 'Please input your address!'
                }
              ]}
            >
              <InputComponent name="address" value={stateUserDetails.address} onChange={handleOnChangeDetails} />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default ProductDetailComponent
