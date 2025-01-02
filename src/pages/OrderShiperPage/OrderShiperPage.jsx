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
import { useLocation } from 'react-router-dom'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useEffect } from 'react'
import { error, success } from '../../components/Message/Message'
import { useQueryClient } from '@tanstack/react-query'

function OrderShiperPage() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const { state } = location
  const user = useSelector((state) => state.user)

  const mutationCheckDelivery = useMutationHook((data) => {
    const res = OrderService.deliveryCheck(data)
    return res
  })
  const mutationGetAll = useMutationHook((data) => {
    const res = OrderService.getAllOrderShipper()
    return res
  })

  useEffect(() => {
    mutationGetAll.mutate()
  }, [])

  const { data: dataShip, isPending: isPendingShip } = mutationGetAll
  const handleDetailsOrder = (id) => {
    console.log(id)
    mutationCheckDelivery.mutate({ orderId: id })
  }
  const mutation = useMutationHook((data) => {
    const { id, token } = data
    const res = OrderService.cancelOrder(id, token)
    return res
  })
  const handleCancelOrder = (order) => {
    mutation.mutate({ id: order._id, token: state?.token })
  }
  const { isPending: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation
  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      success('Đã xóa đơn hàng thành công')
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      error('Xóa dơn hàng thất bại')
    } else if (isErrorCancle) {
      error()
    }
  }, [isErrorCancle, isSuccessCancel])

  useEffect(() => {
    if (mutationCheckDelivery?.isSuccess) {
      mutationGetAll.mutate() // Gọi lại API khi mutationCheckDelivery thành công
    }
  }, [mutationCheckDelivery?.isSuccess])

  useEffect(() => {
    if (mutation?.isSuccess) {
      mutationGetAll.mutate() // Gọi lại API khi mutation thành công
    }
  }, [mutation?.isSuccess])
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
  return dataShip?.data?.length > 0 ? (
    <Loading isLoading={isPendingShip || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: 'red' }}>Đơn hàng cần giao</h2>
          <WrapperListOrder>
            {dataShip?.data?.map((order) => {
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
                        textButton="Đã giao hàng"
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
    <div style={{ display: 'flex', justifyContent: 'center', color: 'red' }}>
      <h1>Không có đơn hàng nào cần dược giao</h1>
    </div>
  )
}

export default OrderShiperPage
