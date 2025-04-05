import { Badge, Col, Divider, Grid, Popover } from 'antd'
import { UserImage, WrapperContentPopUp, WrapperHeader, WrapperHeaderAccount, WrapperTextHeaderSmall } from './style'
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
import logo from '../../assets/image/logo.png'

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

  // const { data, isPending, isSuccess, isError } = mutation

  // useEffect(() => {
  //   setLoading(true)
  //   setUserName(user?.name)
  //   setUserAvatar(user?.avatar)
  //   mutation.mutate({ userId: user.id })
  //   console.log(data)
  //   setLoading(false)
  // }, [user?.name, user?.avatar])

  useEffect(() => {
    // Chỉ gọi API nếu người dùng đã đăng nhập
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
    if (search.trim()) {
      dispatch(searchProduct(search))
    }
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
    <div>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'space-between' }}>
        <Col xs={2} sm={2} md={2} lg={5} flex="none" style={{ height: 'auto' }}>
          <UserImage src={logo} onClick={() => navigate('/')} style={{ cursor: ' pointer' }}></UserImage>
        </Col>
        {!isHiddenSearch && (
          <Col span={13} xs={0} sm={0} md={0} lg={12} flex="auto">
            <ButtonSearch
              backgroundColorInput="#fff"
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
                borderLeft: 'none'
              }}
              bakcgroundColorButton="#000"
              placeholder="Search here..."
              textButton="Tìm kiếm"
              onChange={onSearch}
              onClickButton={onClickButtonSearch}
            />
          </Col>
        )}
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
                        objectFit: 'cover'
                      }}
                      alt="Avatar"
                    />
                  ) : (
                    <UserOutlined style={{ fontSize: '30px' }} />
                  )}
                  {user?.access_token ? (
                    <Popover
                      placement="bottom"
                      title={
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>{userName}</div>
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
                      <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>
                        {user.name}
                      </div>
                    </Popover>
                  ) : (
                    <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                      <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Đăng nhập/đăng ký</WrapperTextHeaderSmall>
                      <div>
                        <WrapperTextHeaderSmall style={{ fontSize: '12px' }}>Tài khoản</WrapperTextHeaderSmall>
                        <CaretDownOutlined />
                      </div>
                    </div>
                  )}
                </WrapperHeaderAccount>
              </Loading>

              {!isHiddenCart && (
                <>
                  <div
                    style={{
                      width: '1px',
                      height: '30px',
                      backgroundColor: '#fff',
                      margin: '0 10px'
                    }}
                  ></div>
                  <div>
                    <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                      <Badge count={order?.orderItems?.length} size="small">
                        <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                      </Badge>
                      <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
