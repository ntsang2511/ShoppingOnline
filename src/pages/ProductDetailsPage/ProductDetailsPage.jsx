import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useEffect } from 'react'

function ProductDetailsPage() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navigateHome = () => {
    navigate('/')
  }
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div style={{ padding: '0 120px', backgroundColor: '#333', height: '1000px' }}>
      <h3 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '0', paddingTop: '15px' }}>
        <span onClick={navigateHome} style={{ cursor: 'pointer', fontWeight: 700 }}>
          Trang chủ
        </span>{' '}
        - Chi tiết sản phẩm
      </h3>
      <div>
        <ProductDetailComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage
