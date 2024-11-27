import { Checkbox } from 'antd'
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
import { useEffect, useMemo, useState } from 'react'
import { convertPrice } from '../../utils'
function OrderPage() {
  const order = useSelector((state) => state.order)
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

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])
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
    if (priceMemo > 200000) {
      return 10000
    } else if (priceMemo === 0) {
      return 0
    } else {
      return 20000
    }
  }, [order])
  const totalPriceMemo = useMemo(() => {
    return priceMemo - priceDiscountMemo * 0.01 * priceMemo + deliveryPriceMemo
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h2 style={{ padding: '10px' }}>Giỏ hàng</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
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
                            <MinusOutlined style={{ fontSize: '20px' }} size="14px" />
                          </button>
                          <WrapperInputNumber min={1} defaultValue={ord?.amount} value={ord?.amount} size="small" />
                          <button
                            onClick={() => handleChangeCount('increase', ord?.product)}
                            style={{ border: 'none', backgroundColor: 'transparent' }}
                          >
                            <PlusOutlined style={{ fontSize: '20px' }} size="14px" />
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
            <ButtonComponent
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
    </div>
  )
}

export default OrderPage
