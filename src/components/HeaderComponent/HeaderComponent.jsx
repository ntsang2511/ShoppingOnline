import { Badge, Col, Divider, Popover } from 'antd'
import {
  WrapperContentPopUp,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall
} from './style'
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
function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const order = useSelector((state) => state.order)

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogOut = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
    navigate('/')
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const handleNavigateProfileDetails = () => {
    navigate('/profile-user')
  }
  const handleNavigateAdmin = () => {
    navigate('/system/admin')
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader href="/">anhsangvlog</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonSearch
              backgroundColorInput="#fff"
              size="large"
              placeholder="Search here..."
              textButton="Tìm kiếm"
              onChange={onSearch}
            />
          </Col>
        )}
        <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
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
                        <WrapperContentPopUp onClick={handleNavigateAdmin}>Quản lý hệ thống</WrapperContentPopUp>
                      )}
                      <WrapperContentPopUp onClick={handleNavigateProfileDetails}>
                        Thông tin người dùng
                      </WrapperContentPopUp>
                      <Divider style={{ margin: '0' }} />
                      <WrapperContentPopUp onClick={handleLogOut}>Đăng xuất</WrapperContentPopUp>
                    </div>
                  }
                  trigger="click"
                >
                  <div style={{ cursor: 'pointer' }}>{user.name}</div>
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
            <div>
              <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                <Badge count={order?.orderItems?.length} size="small">
                  <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                </Badge>
                <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
              </div>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
