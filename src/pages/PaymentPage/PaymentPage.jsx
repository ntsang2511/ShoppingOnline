import { Form } from 'antd'
import { WrapperInfo, WrapperLayout, WrapperLeft, WrapperRight } from './style'
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
import * as CartService from '../../services/CartService'
import { PaymentMethodSection } from '../../components/PaymentMethodSection/PaymentMethodSection'
import { ShippingSection } from '../../components/ShippingSection/ShippingSection'
import { OrderSummary } from '../../components/OrderSumary/OrderSumary'
function PaymentPage() {
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const [stateUserDetails, setStateUserDetails] = useState({ name: '', phone: '', address: '', city: '' })
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }, 500),
    []
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
      return total + current.discount * 0.01 * current.price * current.amount
    }, 0)
    return Number(result) || 0
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
    return priceMemo - priceDiscountMemo + deliveryPriceMemo
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

  const { isPending: isLoadingUpdate } = mutationUpdate
  const { data, isPending, isSuccess, isError } = mutationAddOrder

  const mutationDeleteAll = useMutationHook((data) => {
    const res = CartService.clearCart(data)
    return res
  })

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      const arrayOrder = []
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrder.push(element.product)
      })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrder }))
      mutationDeleteAll.mutate({ userId: user.id, productIds: arrayOrder })
      success('Đặt hàng thành công')
      if (payment !== 'zalopayapp') {
        navigate('/orderSuccess', {
          state: { delivery, payment, order: order?.orderItemsSelected, totalPrice: totalPriceMemo }
        })
      } else {
        if (data?.status === 'OK') {
          const orderId = data?.data?._id
          const newOrderItems = data?.data?.orderItems.map(({ image, ...rest }) => {
            return { ...rest, orderId }
          })
          const orderInfo = {
            totalPrice: totalPriceMemo,
            orderId: data?.data?._id,
            orderInfo: 'Thanh toán đơn hàng qua ZaloPay',
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

  useEffect(() => {
    if (order?.orderItemsSelected?.length === 0 && isSuccess === false) {
      navigate('/order')
    }
  }, [order?.orderItemsSelected?.length])
  const handleCancelUpdate = () => {
    setStateUserDetails({ name: '', phone: '', address: '', city: '' })
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
            window.location.reload()
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
    <div style={{ background: '#1a1a1a', width: '100%' }}>
      <Loading isLoading={isPending}>
        <div style={{ height: '100%', margin: '0 auto' }}>
          <h2 style={{ padding: '10px', color: '#ffc107', fontSize: '2.3rem', paddingLeft: '10%', marginBottom: '0' }}>
            Thanh toán
          </h2>
          <h4
            style={{
              color: '#c2b280',
              paddingLeft: '10%',
              marginTop: 0,
              fontSize: '1.5rem',
              fontWeight: '500',
              marginBottom: '16px'
            }}
          >
            Hoàn tất đơn hàng của bạn
          </h4>
          <WrapperLayout>
            <WrapperLeft>
              <WrapperInfo>
                <ShippingSection delivery={delivery} handleDelivery={handleDelivery} />
              </WrapperInfo>
              <WrapperInfo>
                <PaymentMethodSection payment={payment} handlePayment={handlePayment} />
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <OrderSummary
                user={user}
                priceMemo={priceMemo}
                priceDiscountMemo={priceDiscountMemo}
                deliveryPriceMemo={deliveryPriceMemo}
                totalPriceMemo={totalPriceMemo}
                payment={payment}
                handleChangeAddress={handleChangeAddress}
                handleAddOrder={handleAddOrder}
                handleAddOrderWithZaloPay={handleAddOrderWithZaloPay}
                convertPrice={convertPrice}
              />
            </WrapperRight>
          </WrapperLayout>
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
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 18 }}
              style={{ maxWidth: 1200 }}
              // onFinish={onUpdateUser}
              // onFinishFailed={onFinishFailedDetail}
              autoComplete="off"
              form={form}
            >
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                <InputComponent name="name" value={stateUserDetails.name} onChange={handleOnChangeDetails} />
              </Form.Item>
              <Form.Item label="City" name="city" rules={[{ required: true, message: 'Please input your city!' }]}>
                <InputComponent name="city" value={stateUserDetails.city} onChange={handleOnChangeDetails} />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input your phone!' }]}>
                <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnChangeDetails} />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
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
