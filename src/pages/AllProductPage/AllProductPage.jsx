import { Col, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import ProductHeader from '../../components/ProductHeader/ProductHeader'
import Pagination from '../../components/Pagination/Pagination'
import { useNavigate } from 'react-router-dom'
function AllProductPage() {
  const searchProduct = useSelector((state) => state.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [paginate, setPaginate] = useState({ page: 0, limit: 8, total: 1 })

  const fetchAllProduct = async (page, limit) => {
    setLoading(true)
    const res = await ProductService.getAllProduct(page, limit)
    if (res?.status === 'OK') {
      setProducts(res?.data)
      setPaginate({ ...paginate, total: res?.totalPage })
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllProduct(paginate.page, paginate.limit)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [paginate.page])

  const onChange = (page) => {
    setPaginate({ ...paginate, page: page - 1 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        - Tất cả sản phẩm
      </h3>
      <div style={{ padding: '0 120px', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
        <Row>
          <ProductHeader totalProducts={products.length} onSortChange={setSortBy} />
          <Col span={24} style={{ marginTop: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {displayedProducts
                ?.sort((a, b) => {
                  // Sắp xếp sao cho sản phẩm có countInStock === 1 ở cuối
                  if (a.countInStock === 1 && b.countInStock !== 1) return 1
                  if (a.countInStock !== 1 && b.countInStock === 1) return -1
                  return 0 // Giữ nguyên thứ tự nếu cả hai có countInStock bằng nhau
                })
                ?.map((product) => {
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

export default AllProductPage
