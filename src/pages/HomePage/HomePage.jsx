import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { StickyHeader, WrapperProducts, WrapperTypeProduct } from './style'
import slide3 from '../../assets/image/slide3.jpg'
import slide4 from '../../assets/image/slide4.jpg'
import slide5 from '../../assets/image/slide5.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { searchProduct } from '../../redux/slices/productSlice'
import { useNavigate } from 'react-router-dom'
import { Grid, Space, Typography } from 'antd'
import ButtonSearch from '../../components/ButtonSearch/ButtonSearch'
import { hideSearch } from '../../redux/slices/stateManageSlice'
function HomePage() {
  const productSearch = useSelector((state) => state.product?.search)
  const isShowSearch = useSelector((state) => state.stateManage?.isShowSearch)
  const dispatch = useDispatch()
  const limit = 4
  const navigate = useNavigate()
  const { Title, Paragraph, Text } = Typography
  const [search, setSearch] = useState('')
  const loading = false
  const [typeProduct, setTypeProduct] = useState([])
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getProductBySearch(search, limit)
    return res
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
  }
  const onClickButtonSearch = () => {
    dispatch(searchProduct(search))
  }

  const { isPending, data } = useQuery({
    queryKey: ['products', limit, productSearch],
    queryFn: fetchProductAll,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 3
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProduct(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  const handleNavigateToAllProduct = () => {
    navigate('/products/get-all')
  }
  const { md } = Grid.useBreakpoint()
  useEffect(() => {
    if (md === true) {
      dispatch(hideSearch())
    }
  }, [md, dispatch])

  return (
    <Loading isLoading={isPending || loading}>
      <StickyHeader>
        {isShowSearch && (
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
        )}
        <WrapperTypeProduct>
          <Space size={32}>
            {typeProduct?.map((item, index) => {
              return <TypeProduct name={item} key={index} />
            })}
          </Space>
        </WrapperTypeProduct>
      </StickyHeader>
      <SliderComponent arrImages={[slide3, slide4, slide5]} />
      <div style={{ padding: '0 120px', backgroundColor: ' #1a1a1a' }}>
        <div id="container" style={{ backgroundColor: '#1a1a1a' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px', marginTop: '60px' }}>
            <Text
              style={{
                display: 'inline-block',
                color: '#FFC107',
                fontSize: '16px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Featured Products
            </Text>
            <Title
              level={2}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#FFE8A3',
                marginBottom: '16px',
                marginTop: '16px'
              }}
            >
              Bộ Sưu Tập <span style={{ color: '#FFC107' }}>Đặc Biệt</span>
            </Title>
            <Paragraph
              style={{ fontSize: '20px', color: '#8F9BB3', maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}
            >
              Khám phá những chiếc đồng hồ cao cấp được tuyển chọn kỹ lưỡng từ các thương hiệu danh tiếng
            </Paragraph>
          </div>
          <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {isPending ? (
              <p>Loading</p>
            ) : (
              data?.data
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
                      productId={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      name={product.name}
                      image={product.image}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  )
                })
            )}
          </div>
          <WrapperProducts>
            <ButtonComponent
              textButton={'Xem thêm'}
              type="outlined"
              styleButton={{
                border: '1px solid #FFC107',
                color: `${data?.total === data?.data?.length ? '#ccc' : '#FFC107'}`,
                cursor: `${data?.total === data?.data?.length ? 'not-allowed' : 'pointer'}`,
                width: '240px',
                height: '38px',
                borderRadius: '4px'
              }}
              hoverStyle={{ backgroundColor: '#FFB300', color: '#14171A', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              disabled={data?.total === data?.data?.length || data?.totalPage === 1}
              // onClick={() => {
              //   setLimit((prev) => prev + 6)
              // }}
              onClick={() => handleNavigateToAllProduct()}
              styleTextButton={{ fontWeight: 500 }}
            />
          </WrapperProducts>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage
