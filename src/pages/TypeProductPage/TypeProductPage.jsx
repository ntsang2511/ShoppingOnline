import { Col, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import ProductHeader from '../../components/ProductHeader/ProductHeader'
import Pagination from '../../components/Pagination/Pagination'

function TypeProductPage() {
  const searchProduct = useSelector((state) => state.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const { state } = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })

  const fetchProductType = async (type, page, limit) => {
    setLoading(true)
    const res = await ProductService.getProductType(type, page, limit)
    if (res?.status === 'OK') {
      setProducts(res?.data)
      // Tính lại total dựa trên số lượng sản phẩm thực tế
      const totalPages = Math.ceil(res?.data.length / limit)
      setPaginate({ ...paginate, total: totalPages > 0 ? totalPages : 1 })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit)
    }
  }, [state, paginate.page, paginate.limit])

  const onChange = (page) => {
    setPaginate({ ...paginate, page: page - 1 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  let displayedProducts = products?.filter((prod) => {
    if (searchDebounce === '') {
      return prod
    } else if (prod?.name.toLowerCase().includes(searchDebounce.toLowerCase())) {
      return prod
    }
  })

  displayedProducts = [...displayedProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    } else if (sortBy === 'price-low') {
      return a.price - b.price
    } else if (sortBy === 'price-high') {
      return b.price - a.price
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    return 0
  })
  const navigate = useNavigate()
  const navigateHome = () => {
    navigate('/')
  }

  return (
    <Loading isLoading={loading}>
      <h3 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '0', paddingTop: '15px', marginLeft: '100px' }}>
        <span onClick={navigateHome} style={{ cursor: 'pointer', fontWeight: 700 }}>
          Trang chủ
        </span>{' '}
        - Chi tiết sản phẩm
      </h3>
      <div style={{ padding: '0 120px', backgroundColor: '#1A1A1A', minHeight: '100vh' }}>
        <Row style={{ paddingTop: '10px' }}>
          <Col span={24}>
            <ProductHeader totalProducts={products.length} onSortChange={setSortBy} />
          </Col>
          <Col span={24} style={{ marginTop: '25px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}
            >
              {displayedProducts?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    sell={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                )
              })}
            </div>
          </Col>
          <Col
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '100px',
              marginBottom: '100px'
            }}
          >
            <Pagination currentPage={paginate.page + 1} totalPages={paginate.total} onPageChange={onChange} />
          </Col>
        </Row>
      </div>
    </Loading>
  )
}

export default TypeProductPage
