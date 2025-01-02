import { Col, Pagination, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { WrapperNavbar } from './style'
import * as ProductService from '../../services/ProductService'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
function AllProductPage() {
  const searchProduct = useSelector((state) => state.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const { state } = useLocation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })
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
  }, [paginate.page])

  const onChange = (current, pageSize) => {
    console.log(current, pageSize)
    setPaginate({ ...paginate, page: current - 1, limit: pageSize })
  }
  return (
    <Loading isLoading={loading}>
      <div style={{ padding: '0 120px', backgroundColor: '#efefef', height: '100vh' }}>
        <Row style={{ flexWrap: 'nowrap', paddingtop: '10px' }}>
          {/* <WrapperNavbar span={4}>
            <NavbarComponent />
          </WrapperNavbar> */}
          <Col span={24} style={{ marginTop: '25px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}
            >
              {products
                ?.filter((prod) => {
                  if (searchDebounce === '') {
                    return prod
                  } else if (prod?.name.toLowerCase().includes(searchDebounce.toLowerCase())) {
                    return prod
                  }
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
        </Row>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '170px' }}>
          <Pagination
            current={paginate?.page + 1}
            pageSize={10}
            defaultCurrent={1}
            total={paginate?.total * paginate?.limit}
            onChange={onChange}
          />
        </div>
      </div>
    </Loading>
  )
}

export default AllProductPage
