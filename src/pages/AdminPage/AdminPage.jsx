import { Menu } from 'antd'
import { useState } from 'react'
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { getItem } from '../../utils'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import AdminUser from '../../components/AdminUser/AdminUser'
import AdminProduct from '../../components/AdminProduct/AdminProduct'
import AdminOrder from '../../components/AdminOrder/AdminOrder'
function AdminPage() {
  const items = [
    getItem('Người dùng', 'user', <UserOutlined />),
    getItem('Sản phẩm', 'product', <AppstoreOutlined />),
    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />)
  ]
  const [keySelected, setKeySelected] = useState('')
  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return <AdminUser />
      case 'product':
        return <AdminProduct />
      case 'order':
        return <AdminOrder />
      default:
        return <></>
    }
  }

  const handleOnClick = ({ key }) => {
    setKeySelected(key)
  }
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          style={{ width: 256, boxShadow: '1px 1px 2px #ccc', height: '100vh' }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: '1', padding: '15px' }}>{renderPage(keySelected)}</div>
      </div>
    </>
  )
}

export default AdminPage
