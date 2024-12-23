import {
  Label,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperPriceDiscount,
  WrapperOrderItem,
  WrapperCountOrder,
  WrapperInfoOrderItem
} from './style'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useLocation } from 'react-router-dom'
import { orderConstant } from '../../constant'
import { convertPrice } from '../../utils'

function OrderSuccess() {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const location = useLocation()
  const { state } = location
  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <Loading isLoading={false}>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h2 style={{ padding: '10px' }}>Đơn hàng đã đặt thành công</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Label>Phương thức giao hàng</Label>
                  <WrapperValue>
                    <span style={{ color: '#ea8500', fontWeight: 'bold' }}>
                      {orderConstant.delivery[state?.delivery]}
                    </span>{' '}
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <WrapperValue>{orderConstant.payment[state?.payment]}</WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfoOrderItem>
                {state.order?.map((order, index) => {
                  return (
                    <WrapperOrderItem key={index}>
                      <div style={{ width: '250px', display: 'flex', alignItems: 'center', flex: 1 }}>
                        <img src={order?.image} style={{ width: '77px', height: '77px', objectFit: 'cover' }} />
                        <div
                          style={{
                            width: '230px',
                            marginLeft: '5px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 3, justifyContent: 'space-around' }}>
                        <span>
                          <span style={{ fontSize: '13px', color: '#242424' }}>
                            Giá tiền: {convertPrice(order?.price - order?.discount * 0.01 * order?.price)}
                          </span>
                        </span>
                        <WrapperCountOrder>
                          <span style={{ color: 'rgb(255,66,28)', fontSize: '13px' }}>Số lượng: {order?.amount}</span>
                          <span style={{ color: 'rgb(255,66,28)', fontSize: '13px' }}></span>
                        </WrapperCountOrder>
                      </div>
                    </WrapperOrderItem>
                  )
                })}
              </WrapperInfoOrderItem>
              <div>
                <span style={{ color: 'rgb(255,66,28)', fontSize: '13px' }}>
                  Tổng tiền: {convertPrice(state?.totalPrice)}
                </span>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSuccess
