import { Badge, Col, Divider, Grid, Popover } from 'antd'
import { WrapperContentPopUp, WrapperHeaderAccount, WrapperTextHeaderSmall } from './style'
// import Search from 'antd/es/transfer/search'
import { CaretDownOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import ButtonSearch from '../ButtonSearch/ButtonSearch'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slices/userSlice'
import { useEffect, useState } from 'react'
import Loading from '../LoadingComponent/Loading'
import { searchProduct } from '../../redux/slices/productSlice'
import { resetOrder, setOrderItems } from '../../redux/slices/orderSlice'
import * as CartService from '../../services/CartService'
import { useMutationHook } from '../../hooks/useMutationHook'

// Testing
import { Layout, Space, Typography, Avatar } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { toggleSearch } from '../../redux/slices/stateManageSlice'
import { Watch } from 'lucide-react'

const { Header } = Layout
const { Text } = Typography
function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const order = useSelector((state) => state.order)
  const [cartItems, setCartItems] = useState([])
  const [isOpenPopup, setIsOpenPopup] = useState(false)

  // Check size of the screen
  const { sm, md, lg } = Grid.useBreakpoint()

  const mutation = useMutationHook((data) => {
    const { userId } = data
    const res = CartService.getCart(userId)
    return res
  })
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogOut = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    dispatch(resetOrder())
    setLoading(false)
    navigate('/')
  }

  useEffect(() => {
    if (user?.id && !cartItems.length) {
      setLoading(true)
      mutation.mutate(
        { userId: user.id },
        {
          onSuccess: (response) => {
            setCartItems(response?.data?.items || [])
            dispatch(setOrderItems({ items: response?.data?.items }))
            setLoading(false)
          },
          onError: () => {
            setLoading(false)
          }
        }
      )
    }
    if (!user?.id) {
      dispatch(resetOrder())
    }

    // Cập nhật thông tin user
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user])
  const onSearch = (e) => {
    setSearch(e.target.value)
  }

  const onClickButtonSearch = () => {
    dispatch(searchProduct(search))
  }
  const handleClickNavigate = (type = '') => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else if (type === 'order-shiper') {
      navigate('/order-shiper')
    } else if (type === 'my-shipped-order') {
      navigate('/my-shipped-order')
    } else {
      handleLogOut()
    }
    setIsOpenPopup(false)
  }
  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#1A1A1A',
        borderBottom: '1px solid #333',
        backdropFilter: 'blur(6px)',
        backgroundImage: 'linear-gradient(rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.95))',
        padding: '0 16px',
        color: '#fff',
        height: 'auto'
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
          {/* Logo */}
          <Space align="center" size={8} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Avatar
              style={{
                background: '#FFC107',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ccc'
              }}
              size={45}
              icon={<Watch size={30} style={{ color: '#331600' }} />}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  fontFamily: '"Playfair Display", serif',
                  color: '#fff',
                  height: '24px'
                }}
              >
                WATCH SHOP
              </Text>
              <Text style={{ fontSize: '12px', color: '#ccc', letterSpacing: '0.1em', fontWeight: '700' }}>
                BEST SHOP EVER
              </Text>
            </div>
          </Space>

          {/* Search bar */}
          <div style={{ flex: 1, maxWidth: 600, margin: '0 32px' }}>
            {!isHiddenSearch && (
              <>
                {md ? (
                  <ButtonSearch
                    backgroundColorInput="#1a1a1a !important"
                    size="large"
                    style={{
                      borderTopLeftRadius: '20px',
                      borderBottomLeftRadius: '20px',
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0
                    }}
                    styleForButton={{
                      borderTopRightRadius: '20px',
                      borderBottomRightRadius: '20px',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      borderLeft: 'none',
                      backgroundColor: '#FFC107',
                      border: 'none'
                    }}
                    placeholder="Search here..."
                    textButton="Tìm kiếm"
                    onChange={onSearch}
                    onClickButton={onClickButtonSearch}
                  />
                ) : (
                  <div
                    onClick={() => {
                      dispatch(toggleSearch())
                    }}
                  >
                    <SearchOutlined style={{ fontSize: 24, color: '#fff', cursor: 'pointer' }} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* User actions */}
          <Col
            span={6}
            xs={10}
            sm={12}
            md={12}
            lg={7}
            flex="none"
            style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
          >
            {(lg || md || sm) && (
              <div style={{ display: 'flex' }}>
                <Loading isLoading={loading}>
                  <WrapperHeaderAccount>
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        style={{
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #FFC107'
                        }}
                        alt="Avatar"
                      />
                    ) : (
                      <UserOutlined style={{ fontSize: '30px', color: '#FFC107' }} />
                    )}
                    {user?.access_token ? (
                      <Popover
                        placement="bottom"
                        title={
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'center', color: '#FFC107' }}>
                              {userName}
                            </div>
                            <Divider style={{ margin: '3px' }} />
                          </div>
                        }
                        content={
                          <div>
                            {user?.isAdmin && (
                              <WrapperContentPopUp onClick={() => handleClickNavigate('admin')}>
                                Quản lý hệ thống
                              </WrapperContentPopUp>
                            )}
                            {user?.isShipper && (
                              <WrapperContentPopUp onClick={() => handleClickNavigate('order-shiper')}>
                                Thông tin đơn hàng cần giao
                              </WrapperContentPopUp>
                            )}
                            <WrapperContentPopUp onClick={() => handleClickNavigate('profile')}>
                              Thông tin người dùng
                            </WrapperContentPopUp>
                            <WrapperContentPopUp onClick={() => handleClickNavigate(`my-order`)}>
                              Đơn hàng của tôi
                            </WrapperContentPopUp>
                            <WrapperContentPopUp onClick={() => handleClickNavigate(`my-shipped-order`)}>
                              Đánh giá đơn hàng
                            </WrapperContentPopUp>
                            <Divider style={{ margin: '0' }} />
                            <WrapperContentPopUp onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopUp>
                          </div>
                        }
                        trigger="click"
                        open={isOpenPopup}
                      >
                        <div
                          style={{ cursor: 'pointer', color: '#FFC107' }}
                          onClick={() => setIsOpenPopup((prev) => !prev)}
                        >
                          {user.name}
                        </div>
                      </Popover>
                    ) : (
                      <div
                        onClick={handleNavigateLogin}
                        style={{ cursor: 'pointer', display: 'flex', color: '#FFC107' }}
                      >
                        <WrapperTextHeaderSmall style={{ fontSize: '12px', color: '#FFC107', marginRight: '5px' }}>
                          Đăng nhập/đăng ký
                        </WrapperTextHeaderSmall>
                        <CaretDownOutlined />
                      </div>
                    )}
                  </WrapperHeaderAccount>
                </Loading>

                {!isHiddenCart && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '1px',
                        height: '30px',
                        backgroundColor: '#FFC107',
                        margin: '0 10px'
                      }}
                    ></div>
                    <div style={{ marginTop: '5px' }}>
                      <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                        <Badge count={order?.orderItems?.length} size="small">
                          <ShoppingCartOutlined style={{ fontSize: '30px', color: '#FFC107' }} />
                        </Badge>
                        <WrapperTextHeaderSmall style={{ color: '#FFC107' }}>Giỏ hàng</WrapperTextHeaderSmall>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
        </div>
      </div>
    </Header>
  )
}

export default HeaderComponent
