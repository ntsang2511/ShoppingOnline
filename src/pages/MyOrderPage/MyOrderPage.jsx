import { useQuery } from '@tanstack/react-query'
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

function MyOrderPage() {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(user?.id, user?.access_token)
    return res.data
  }

  const queryOrder = useQuery(
    {
      queryKey: ['orders'],
      queryFn: fetchMyOrder
    }
    // {
    //   enabled: state?.id && state?.token
    // }
  )

  const { isPending, data } = queryOrder
  console.log(data)
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }
  const mutation = useMutationHook((data) => {
    const { id, token } = data
    const res = OrderService.cancelOrder(id, token)
    return res
  })
  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order._id, token: state?.token },
      {
        onSettled: () => {
          queryOrder.refetch()
        }
      }
    )
  }
  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation
  console.log(isSuccessCancel, isErrorCancle, dataCancel)
  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      success('Đã xóa đơn hàng thành công')
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      error('Xóa dơn hàng thất bại')
    } else if (isErrorCancle) {
      error()
    }
  }, [isErrorCancle, isSuccessCancel])
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
  return data?.length > 0 ? (
    <Loading isLoading={isPending || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: 'red', margin: 0, paddingTop: '20px' }}>Đơn hàng của tôi</h2>
          <WrapperListOrder>
            {data?.map((order) => {
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
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textButton="Hủy đơn hàng"
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      ></ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #9255FD',
                          borderRadius: '4px'
                        }}
                        textButton="Xem chi tiết"
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
      <h1>
        Bạn hiện chưa đặt hàng, hãy quay lại{' '}
        <a href="/" style={{ textDecoration: 'underline' }}>
          trang chủ
        </a>{' '}
        để đặt hàng
      </h1>
    </div>
  )
}

export default MyOrderPage
