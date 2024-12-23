import { Checkbox, Form } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperInputNumber,
  WrapperLeft,
  WrapperListOrder,
  WrapperOrderItem,
  WrapperPriceDiscount,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDelivery,
  WrapperTotal
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
import StepComponent from '../../components/StepComponent/StepComponent'
function OrderPage() {
  const navigate = useNavigate()
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [form] = Form.useForm()

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([])

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => {
        return item !== e.target.value
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }
  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
    }
  }

  const handleDeleteOrder = (idProduct) => {
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
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
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
    if (Number(result)) {
      return result
    }
    return 0
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
  const {
    data: updatedData,
    isPending: isLoadingUpdate,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated
  } = mutationUpdate
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone: '',
      address: '',
      city: ''
    })
    setIsOpenModalUpdateInfo(false)
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

  const itemStep = [
    {
      title: '20.000 VND',
      description: 'Dưới 200.000 VND'
    },
    {
      title: '10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
      subTitle: 'Left 00:00:08'
    },
    {
      title: '0 VND',
      description: 'Từ 500.000 VND trở lên'
    }
  ]
  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h2 style={{ padding: '10px' }}>Giỏ hàng</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperStyleHeaderDelivery>
              <StepComponent
                items={itemStep}
                current={deliveryPriceMemo === 10000 ? 1 : deliveryPriceMemo === 20000 ? 0 : 2}
              />
            </WrapperStyleHeaderDelivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', flex: 1 }}>
                <Checkbox
                  onChange={handleOnChangeCheckAll}
                  style={{ marginRight: '10px' }}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span>Tất cả ({order?.orderItems?.length || 0} sản phẩm)</span>
              </span>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span style={{ marginLeft: '36px' }}>Số lượng</span>
                <span style={{ paddingLeft: '62px' }}>Thành tiền</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>
            <WrapperStyleHeader>
              <WrapperListOrder>
                {order?.orderItems?.map((ord, index) => {
                  return (
                    <WrapperOrderItem key={index}>
                      <div style={{ width: '250px', display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Checkbox
                          onChange={onChange}
                          value={ord?.product}
                          style={{ marginRight: '10px' }}
                          checked={listChecked.includes(ord?.product)}
                        ></Checkbox>
                        <img src={ord?.image} style={{ width: '77px', height: '77px', objectFit: 'cover' }} />
                        <div
                          style={{
                            width: '230px',
                            marginLeft: '5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {ord?.name}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 3, justifyContent: 'space-between' }}>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(ord?.price)}</span>
                          <WrapperPriceDiscount>
                            -{convertPrice(`${ord?.discount * 0.01 * ord?.price}`)}
                          </WrapperPriceDiscount>
                        </span>
                        <WrapperCountOrder>
                          <button
                            onClick={() => handleChangeCount('decrease', ord?.product)}
                            style={{ border: 'none', backgroundColor: 'transparent' }}
                          >
                            <MinusOutlined style={{ fontSize: '20px' }} size="14px" min={1} max={ord?.countInStock} />
                          </button>
                          <WrapperInputNumber
                            min={1}
                            max={ord?.countInStock}
                            defaultValue={ord?.amount}
                            value={ord?.amount}
                            size="small"
                          />
                          <button
                            onClick={() => handleChangeCount('increase', ord?.product)}
                            style={{ border: 'none', backgroundColor: 'transparent' }}
                          >
                            <PlusOutlined style={{ fontSize: '20px' }} size="14px" min={1} max={ord?.countInStock} />
                          </button>
                        </WrapperCountOrder>
                        <span style={{ color: 'rgb(255,66,28)', fontSize: '13px' }}>
                          {convertPrice(ord?.price * ord?.amount)}
                        </span>
                        <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(ord?.product)} />
                      </div>
                    </WrapperOrderItem>
                  )
                })}
              </WrapperListOrder>
            </WrapperStyleHeader>
          </WrapperLeft>
          <WrapperRight>
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
                    {convertPrice(priceDiscountMemo)}
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
            <ButtonComponent
              onClick={() => handleAddCard()}
              styleButton={{
                background: 'rgb(255,57,69)',
                height: '40px',
                width: '290px',
                marginLeft: '41px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px' }}
            />
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
    </div>
  )
}

export default OrderPage
