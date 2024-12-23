import { Form, Radio } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Label, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style'
import { useDispatch, useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { error, success } from '../../components/Message/Message'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { convertPrice } from '../../utils'
import Loading from '../../components/LoadingComponent/Loading'
import InputComponent from '../../components/InputComponent/InputComponent'
import * as UserService from '../../services/UserService'
import { debounce } from 'lodash'
import { useMutationHook } from '../../hooks/useMutationHook'
import { updateUser } from '../../redux/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../redux/slices/orderSlice'
import * as PaymentService from '../../services/PaymentService'
function PaymentPage() {
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }))
    }, 500),
    [] // Delay 500ms
  )

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

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, current) => {
      return total + current.price * current.amount
    }, 0)
    return result
  }, [order])
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, current) => {
      return total + current.discount * current.amount
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])
  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000 && priceMemo <= 500000) {
      return 10000
    } else if (priceMemo === 0 || priceMemo > 500000) {
      return 0
    } else {
      return 20000
    }
  }, [order])
  const totalPriceMemo = useMemo(() => {
    return priceMemo - priceDiscountMemo * 0.01 * priceMemo + deliveryPriceMemo
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

  const mutationAddOrder = useMutationHook((data) => {
    const { token, ...rests } = data
    const res = OrderService.createOrder(rests, token)
    return res
  })
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = UserService.updateUser(id, rests.data, token)
    return res
  })

  const {
    data: updatedData,
    isPending: isLoadingUpdate,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated
  } = mutationUpdate
  const { data, isPending, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      const arrayOrder = []
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrder.push(element.product)
      })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrder }))
      success('Đặt hàng thành công')
      console.log(data)
      if (payment !== 'zalopayapp') {
        navigate('/orderSuccess', {
          state: {
            delivery,
            payment,
            order: order?.orderItemsSelected,
            totalPrice: totalPriceMemo
          }
        })
      } else {
        if (data?.status === 'OK') {
          const orderId = data?.data?._id
          const newOrderItems = data?.data?.orderItems.map(({ image, ...rest }) => {
            return {
              ...rest,
              orderId
            }
          })
          const orderInfo = {
            totalPrice: totalPriceMemo,
            orderId: data?.data?._id, // Lấy ID đơn hàng từ phản hồi
            orderInfo: 'Thanh toán đơn hàng qua ZaloPay', // Thông tin đơn hàng
            items: newOrderItems,
            user: data?.data?.user
          }
          try {
            PaymentService.createZaloPayOrder(orderInfo)
              .then((response) => {
                console.log('response', response)
                if (response?.data?.order_url) {
                  window.location.href = response?.data?.order_url
                } else {
                  error('Không thể tạo thanh toán qua ZaloPay')
                }
              })
              .catch((err) => {
                console.error('Lỗi khi gọi API ZaloPay:', err)
                error('Đã xảy ra lỗi khi tạo thanh toán qua ZaloPay')
              })
          } catch (err) {
            console.log('Lỗi khi gọi API ZaloPay:', err)
            error('Đã xảy ra lỗi khi tạo thanh toán qua ZaloPay')
          }
        }
      }
    } else if (isError) {
      error()
    }
  }, [isSuccess, isError, data?.status])
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone: '',
      address: '',
      city: ''
    })
    setIsOpenModalUpdateInfo(false)
  }

  const handleAddOrderWithZaloPay = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullname: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: Number(deliveryPriceMemo),
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email
      })
    }
  }

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullname: user?.name,
        address: user?.address,
        city: user?.city,
        phone: user?.phone,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: Number(deliveryPriceMemo),
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email
      })
    }
  }

  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, data: { ...stateUserDetails } },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }))
            setIsOpenModalUpdateInfo(false)
          }
        }
      )
    }
  }

  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }
  const handlePayment = (e) => {
    setPayment(e.target.value)
  }
  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <Loading isLoading={isPending}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h2 style={{ padding: '10px' }}>Thanh toán</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức giao hàng</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast">
                      <span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JEK</span> Giao hàng tiết kiệm
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức thanh toán</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="zalopayapp"> Thanh toán tiền bằng ZaloPay</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight style={{ marginLeft: '100px' }}>
              <WrapperInfo style={{ marginLeft: '40px' }}>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ color: 'blue', fontWeight: 'bold' }}>
                    {user?.address} {user?.city}
                  </span>
                  <span onClick={handleChangeAddress} style={{ paddingLeft: '5px', color: 'blue', cursor: 'pointer' }}>
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>
              <div style={{ width: '100%' }}>
                <WrapperInfo>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Tạm tính</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 700 }}>{convertPrice(priceMemo)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Giảm giá</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 700 }}>
                      {convertPrice(priceDiscountMemo * 0.01 * priceMemo)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Phí giao hàng</span>
                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 700 }}>
                      {convertPrice(deliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span style={{ fontSize: '20px' }}>Tổng tiền</span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: 'rgb(254,56,52)', fontSize: '24px' }}>{convertPrice(totalPriceMemo)}</span>
                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === 'zalopayapp' ? (
                <ButtonComponent
                  onClick={() => handleAddOrderWithZaloPay()}
                  styleButton={{
                    background: 'rgb(255,57,69)',
                    height: '40px',
                    width: '290px',
                    marginLeft: '41px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textButton={'Thanh toán bằng ZaloPay'}
                  styleTextButton={{ color: '#fff', fontSize: '15px' }}
                />
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  styleButton={{
                    background: 'rgb(255,57,69)',
                    height: '40px',
                    width: '290px',
                    marginLeft: '41px',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                  textButton={'Đặt hàng'}
                  styleTextButton={{ color: '#fff', fontSize: '15px' }}
                />
              )}
            </WrapperRight>
          </div>
        </div>

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
    </div>
  )
}

export default PaymentPage
