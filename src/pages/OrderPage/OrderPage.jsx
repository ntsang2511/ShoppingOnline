import { Form } from 'antd'
import {
  ButtonDeleteAll,
  WrapperLeft,
  WrapperListOrder,
  WrapperOrderItem,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDelivery,
  WrapperContainer,
  CheckBoxAll
} from './style'
import { useDispatch, useSelector } from 'react-redux'
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder
} from '../../redux/slices/orderSlice'
import { error } from '../../components/Message/Message'
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
import * as CartService from '../../services/CartService'
import StepComponent from '../../components/StepComponent/StepComponent'
import CartSummary from '../../components/CartSumary/CartSumary'
import CartItem from '../../components/CartItem/CartItem'

function OrderPage() {
  const navigate = useNavigate()
  const [stateUserDetails, setStateUserDetails] = useState({ name: '', phone: '', address: '', city: '' })
  const [form] = Form.useForm()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([])

  const mutationDeleteOne = useMutationHook((data) => {
    const res = CartService.removeItem(data)
    return res
  })

  const mutationDeleteAll = useMutationHook((data) => {
    const res = CartService.clearCart(data)
    return res
  })

  const mutationAmount = useMutationHook((data) => {
    return CartService.updateItemAmount(data)
  })

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }

  const handleChangeCount = (type, idProduct, order) => {
    const newAmount = type === 'increase' ? order?.amount + 1 : order?.amount - 1
    if (newAmount < 1 || newAmount > order?.countInStock) {
      error('Số lượng không hợp lệ')
      return
    }
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
    }

    mutationAmount.mutate({ userId: user?.id, product: idProduct, amount: newAmount })
  }

  const handleDeleteOrder = (idProduct) => {
    mutationDeleteOne.mutate({ userId: user.id, product: idProduct })
    dispatch(removeOrderProduct({ idProduct }))
  }

  const handleOnChangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }))
      mutationDeleteAll.mutate({ userId: user.id, productIds: listChecked })
    }
  }

  const handleOnChangeDetails = useCallback(
    debounce((e) => {
      setStateUserDetails((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
    }, 500),
    []
  )

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

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
    if (priceMemo > 200000 && priceMemo < 500000) {
      return 10000
    } else if ((priceMemo === 0 && order?.orderItemsSelected?.length === 0) || priceMemo >= 500000) {
      return 0
    } else {
      return 20000
    }
  }, [order])

  const totalPriceMemo = useMemo(() => {
    return priceMemo - priceDiscountMemo + deliveryPriceMemo
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

  const handleAddCard = () => {
    if (order.orderItemsSelected?.length === 0) {
      error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = UserService.updateUser(id, rests.data, token)
    return res
  })

  const { isPending: isLoadingUpdate } = mutationUpdate

  const handleCancelUpdate = () => {
    setStateUserDetails({ name: '', phone: '', address: '', city: '' })
    setIsOpenModalUpdateInfo(false)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

  const itemStep = [
    { title: 'Giảm 20.000 VND', description: 'Dưới 200.000 VND' },
    { title: 'Giảm 10.000 VND', description: 'Từ 200.000 VND đến dưới 500.000 VND' },
    { title: 'Free Ship', description: 'Từ 500.000 VND trở lên' }
  ]

  const currentStep = useMemo(() => {
    if (order?.orderItemsSelected?.length === 0) {
      return 0 // Mặc định bước đầu tiên khi chưa có sản phẩm
    }
    return deliveryPriceMemo === 10000 ? 1 : deliveryPriceMemo === 20000 ? 0 : 2
  }, [order, deliveryPriceMemo])

  return (
    <div style={{ background: '#1a1a1a', width: '100%' }}>
      <div style={{ height: '100%', width: '100%', margin: '0 auto' }}>
        <h2
          style={{
            padding: '10px 10px 0px 10%',
            fontSize: '2.3rem',
            marginTop: 0,
            color: '#ffc107',
            marginBottom: '6px'
          }}
        >
          Giỏ hàng
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
          {order?.orderItems?.length || 0} sản phẩm trong giỏ hàng
        </h4>
        <WrapperContainer>
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent items={itemStep} current={currentStep} />
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
              {order?.orderItems?.length > 0 ? (
                <span style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <div style={{ padding: '5px 15px' }}>
                    <CheckBoxAll
                      onChange={handleOnChangeCheckAll}
                      checked={listChecked?.length === order?.orderItems?.length}
                    ></CheckBoxAll>
                    <span style={{ color: '#ffe8a3' }}>Tất cả ({order?.orderItems?.length || 0} sản phẩm)</span>
                  </div>
                  {listChecked?.length > 0 && (
                    <ButtonDeleteAll onClick={handleRemoveAllOrder}>Xóa tất cả</ButtonDeleteAll>
                  )}
                </span>
              ) : (
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h1 style={{ color: 'red', fontSize: '30px' }}>Chưa có sản phẩm nào trong giỏ hàng</h1>
                </div>
              )}
            </WrapperStyleHeader>
            <WrapperStyleHeader>
              <WrapperListOrder>
                {order?.orderItems?.map((ord, index) => (
                  <WrapperOrderItem key={index}>
                    <CartItem
                      name={ord?.name}
                      image={ord?.image}
                      price={convertPrice(ord?.price)}
                      totalPrice={convertPrice(
                        ord?.price * ord?.amount - ord?.discount * 0.01 * ord?.price * ord?.amount
                      )}
                      discountPrice={convertPrice(`${ord?.discount * 0.01 * ord?.price}`)}
                      onQuantityChangeDecrease={() => handleChangeCount('decrease', ord?.product, ord)}
                      onQuantityChangeIncrease={() => handleChangeCount('increase', ord?.product, ord)}
                      quantity={ord?.amount}
                      onRemove={() => handleDeleteOrder(ord?.product)}
                      isChecked={listChecked.includes(ord?.product)}
                      onChange={onChange}
                      checkValue={ord?.product}
                    />
                  </WrapperOrderItem>
                ))}
              </WrapperListOrder>
            </WrapperStyleHeader>
          </WrapperLeft>
          <WrapperRight>
            <CartSummary
              subtotal={convertPrice(priceMemo)}
              discount={convertPrice(priceDiscountMemo)}
              shipping={convertPrice(deliveryPriceMemo)}
              total={convertPrice(totalPriceMemo)}
              address={`${user?.address} ${user?.city}`}
              onClickBtnAddress={handleChangeAddress}
              onClickBtnBuy={handleAddCard}
            />
          </WrapperRight>
        </WrapperContainer>
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
    </div>
  )
}

export default OrderPage
