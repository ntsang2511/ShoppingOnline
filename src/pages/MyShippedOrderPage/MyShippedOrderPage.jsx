import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItem,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus
} from './style'
import { convertPrice } from '../../utils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useEffect } from 'react'
import { error, success } from '../../components/Message/Message'

function MyShippedOrderPage() {
  const location = useLocation()
  const { state } = location
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const mutationGetAllShippedOrder = useMutationHook((data) => {
    const res = OrderService.getShippedOrder(data)
    return res
  })
  const { data, isPending, isSuccess } = mutationGetAllShippedOrder

  useEffect(() => {
    mutationGetAllShippedOrder.mutate(user.id)
  }, [])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <img
            src={order?.image}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'cover',
              border: '1px solid rgb(238, 238, 238)',
              padding: '2px'
            }}
          />
          <div
            style={{
              width: 260,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginLeft: '10px'
            }}
          >
            {order?.name}
          </div>
          <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
        </WrapperHeaderItem>
      )
    })
  }
  const handleRatingProduct = (order) => {
    const productId = order.orderItems[0].product
    navigate(`/product-details/${productId}`)
  }
  return data?.data?.length > 0 ? (
    <Loading isLoading={isPending}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: 'red', margin: 0, paddingTop: '20px' }}>Đơn hàng đã giao của bạn</h2>
          <WrapperListOrder>
            {data?.data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                      <span
                        style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}
                      >{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                      <span
                        style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}
                      >{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                      <span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <ButtonComponent
                        onClick={() => handleRatingProduct(order)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textButton="Đánh giá sản phẩm"
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', color: 'red', backgroundColor: '#333' }}>
      <h1>Không có đơn hàng nào cần dược giao</h1>
    </div>
  )
}

export default MyShippedOrderPage
