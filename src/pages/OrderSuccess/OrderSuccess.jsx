import { Layout, Card, Button, Divider, Tag, Row, Col, Space } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, CreditCardOutlined, GiftOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { orderConstant } from '../../constant'
import { convertPrice } from '../../utils'
import Loading from '../../components/LoadingComponent/Loading'

const { Content } = Layout

function OrderSuccess() {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  return (
    <div style={{ background: '#1a1a1a', width: '100%' }}>
      <Loading isLoading={false}>
        <div style={{ height: '100%', width: '100%' }}>
          <Layout style={{ background: '#1a1a1a' }}>
            <Content style={{ padding: '32px 16px', maxWidth: '1024px', margin: '0 auto' }}>
              {/* Success Banner */}
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <CheckCircleOutlined style={{ fontSize: 64, color: '#00FF00' }} />
                <h1 style={{ color: '#FFC107', fontSize: 32, fontWeight: 'bold', margin: '8px 0' }}>
                  Đơn hàng đã đặt thành công
                </h1>
                <p style={{ color: '#C9B89B', fontSize: 18 }}>
                  Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
                </p>
              </div>

              <Row gutter={[16, 16]}>
                {/* Shipping Info */}
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <Space>
                        <GiftOutlined style={{ fontSize: 20, color: '#FFC107' }} />
                        <span style={{ color: '#FFC107' }}>Phương thức giao hàng</span>
                      </Space>
                    }
                    style={{ background: '#1F1F1F', borderColor: '#333333' }}
                    headStyle={{ borderColor: '#333333', color: '#FFC107' }}
                    bodyStyle={{ color: '#C9B89B' }}
                  >
                    <Space>
                      <Tag
                        style={{
                          background: 'rgba(255, 193, 7, 0.2)',
                          color: '#FFC107',
                          borderColor: 'rgba(255, 193, 7, 0.3)'
                        }}
                      >
                        <ClockCircleOutlined style={{ fontSize: 12, marginRight: 4 }} />
                        {orderConstant.delivery[state?.delivery] || 'FAST'}
                      </Tag>
                      <span>Giao hàng tiết kiệm</span>
                    </Space>
                  </Card>
                </Col>

                {/* Payment Info */}
                <Col xs={24} md={12}>
                  <Card
                    title={
                      <Space>
                        <CreditCardOutlined style={{ fontSize: 20, color: '#FFC107' }} />
                        <span style={{ color: '#FFC107' }}>Phương thức thanh toán</span>
                      </Space>
                    }
                    style={{ background: '#1F1F1F', borderColor: '#333333' }}
                    headStyle={{ borderColor: '#333333', color: '#FFC107' }}
                    bodyStyle={{ color: '#C9B89B' }}
                  >
                    <p style={{ margin: 0 }}>{orderConstant.payment[state?.payment]}</p>
                  </Card>
                </Col>
              </Row>

              {/* Order Items */}
              <Card
                title={<span style={{ color: '#FFC107' }}>Chi tiết đơn hàng</span>}
                style={{ marginTop: 24, background: '#1F1F1F', borderColor: '#333333' }}
                headStyle={{ borderColor: '#333333' }}
                bodyStyle={{ color: '#C9B89B' }}
              >
                {state.order?.map((order, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: index < state.order.length - 1 ? 16 : 0
                    }}
                  >
                    <div style={{ width: 96, height: 96, background: '#262626', borderRadius: 8, overflow: 'hidden' }}>
                      <img
                        src={order?.image}
                        alt={order?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#FFC107', fontSize: 18, fontWeight: '600', margin: 0 }}>{order?.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                        <p style={{ margin: 0 }}>
                          Giá tiền: {convertPrice(order?.price - order?.discount * 0.01 * order?.price)}
                        </p>
                        <div>
                          <span style={{ fontSize: 14 }}>Số lượng: </span>
                          <span style={{ color: '#FFC107', fontWeight: '600' }}>{order?.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Divider style={{ background: '#333333', margin: '24px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#FFC107', fontSize: 20, fontWeight: 'bold' }}>Tổng tiền:</span>
                  <span style={{ color: '#FFC107', fontSize: 24, fontWeight: 'bold' }}>
                    {convertPrice(state?.totalPrice)}
                  </span>
                </div>
              </Card>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
                <Button
                  onClick={() => {
                    navigate('/my-order')
                  }}
                  style={{ borderColor: '#333333', color: '#FFC107', padding: '24px', fontWeight: '600' }}
                >
                  Theo dõi đơn hàng
                </Button>
                <Button
                  onClick={() => {
                    navigate('/products/get-all')
                  }}
                  type="primary"
                  style={{
                    background: '#FFC107',
                    color: '#1A1A1A',
                    padding: '24px',
                    fontWeight: '600'
                  }}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </Content>
          </Layout>
        </div>
      </Loading>
    </div>
  )
}

export default OrderSuccess
