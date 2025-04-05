import { Button, Col, Form, Image, Pagination, Rate, Row, Select } from 'antd'
import {
  ReviewItem,
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
import TextArea from 'antd/es/input/TextArea'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import InputComponent from '../InputComponent/InputComponent'
import { debounce } from 'lodash'

function ProductDetailComponent({ idProduct }) {
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const user = useSelector((state) => state.user)
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
  const { isSuccess } = mutationCreateRating
  const { isPending: isPendingDelete, isSuccess: isSuccessDelete } = mutationDeleteRating
  const { isPending: isLoadingUpdate } = mutationUpdate
  useEffect(() => {
    if (productDetails?.name) {
      let name = productDetails?.name
      let page = paginate.page
      let limit = paginate.limit
      mutationProductRating.mutate(
        { name, page, limit },
        {
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
        }
      )
    }
  }, [productDetails, isSuccess, isSuccessDelete])
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

  const parseDescription = (text) => {
    // Tách đoạn văn bản dựa trên dấu `##`
    const lines = text?.split('\n')?.filter((line) => line.trim() !== '')
    return lines?.map((line, index) => {
      if (line?.startsWith('##')) {
        // Nếu dòng bắt đầu bằng `##`, trả về nội dung in đậm
        return (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', color: '#FFD700' }}>
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
  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }, 500),
    [] // Delay 500ms
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
  const handleDelete = (id) => {
    mutationDeleteRating.mutate(id)
  }
  const onFinishFailed = () => {}
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
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
    console.log('Updated paginate:', paginate)
  }, [paginate])
  useEffect(() => {
    fetchAllComment(productDetails?.name, paginate.page, paginate.limit)
  }, [paginate.page, productDetails?.name])
  const onChangePaginate = (current, pageSize) => {
    console.log(current, pageSize)
    setPaginate({ ...paginate, page: current - 1, limit: pageSize })
  }
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
            <span style={{ color: 'blue' }}>{user.address}</span>-
            <span onClick={handleChangeAddress} className="change_address" style={{ cursor: 'pointer' }}>
              Đổi địa chỉ
            </span>
          </WrapperAddressProduct>
          <div>
            <LikeButtonComponent dataHref={'https://developers.facebook.com/docs/plugins/'} />
          </div>
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
        <div style={{ marginTop: '50px', padding: '16px', backgroundColor: '#3A3A3A', width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', color: '#E57373', fontSize: '3rem' }}>
            <h3>Thông tin mô tả</h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'start', color: '#000' }}>
            {isPending || isFetching ? (
              <p style={{ fontSize: '2rem', color: '#000' }}>Đang tải thông tin mô tả...</p>
            ) : (
              parseDescription(productDetails?.description)
            )}
          </div>
        </div>
        <div style={{ width: '100%', backgroundColor: '#3A3A3A', paddingTop: '100px' }}>
          <h2 style={{ color: '#FFD700' }}>Đánh giá của bạn</h2>
          <Form
            name="basic"
            labelCol={{
              span: 2.5
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
            <Form.Item label={<span style={{ color: '#FFDD99' }}>Đánh giá chất lượng</span>} name="rating">
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
            <Form.Item label={<span style={{ color: '#FFDD99' }}>Bình luận</span>} name="comment">
              <TextArea
                name="comment"
                style={{ height: '200px', border: '2px solid #000' }}
                value={stateProductRating?.comment}
                onChange={handleOnChange}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 21,
                span: 16
              }}
            >
              <Button
                style={{ padding: '20px 43px', backgroundColor: 'rgb(255, 57, 69)', fontWeight: 'bold' }}
                type="primary"
                htmlType="submit"
              >
                Đăng
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div style={{ width: '100%', borderTop: '1px solid #ccc' }}></div>
        <div style={{ width: '100%' }}>
          <h2 style={{ color: 'red', paddingTop: '100px' }}>Đánh giá của sản phẩm</h2>
          {dataProductRating?.data?.length > 0 ? (
            <ul style={{ padding: 0, margin: 0 }}>
              {dataProductRating?.data?.map((review, index) => {
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
              <Pagination
                current={paginate?.page + 1}
                pageSize={10}
                defaultCurrent={1}
                total={paginate?.total * paginate?.limit}
                onChange={onChangePaginate}
              />
            </ul>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: '2rem', color: 'red' }}>No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </Row>
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
            // onFinish={onUpdateUser}
            // onFinishFailed={onFinishFailedDetail}
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
    </Loading>
  )
}

export default ProductDetailComponent
