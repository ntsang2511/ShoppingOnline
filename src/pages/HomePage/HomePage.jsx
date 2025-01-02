import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperProducts, WrapperTypeProduct } from './style'
import slide3 from '../../assets/image/slide3.jpg'
import slide4 from '../../assets/image/slide4.jpg'
import slide5 from '../../assets/image/slide5.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { useNavigate } from 'react-router-dom'
function HomePage() {
  const searchProduct = useSelector((state) => state.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [limit, setLimit] = useState(5)
  const navigate = useNavigate()
  // const [page, setPage] = useState(5)
  const [loading, setLoading] = useState(false)
  const [typeProduct, setTypeProduct] = useState([])
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getProductBySearch(search, limit)
    return res
  }

  const { isPending, data, isFetching } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 3
  })

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

  return (
    <Loading isLoading={isPending || loading}>
      <div style={{ padding: '0 120px', backgroundColor: ' #333333' }}>
        <WrapperTypeProduct>
          {typeProduct?.map((item, index) => {
            return <TypeProduct name={item} key={index} />
          })}
        </WrapperTypeProduct>
        <div id="container" style={{ backgroundColor: '#333333' }}>
          <SliderComponent arrImages={[slide3, slide4, slide5]} />
          <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {isPending ? (
              <p>Loading</p>
            ) : (
              data?.data
                ?.sort((a, b) => {
                  // Sắp xếp sao cho sản phẩm có countInStock === 0 ở cuối
                  if (a.countInStock === 0 && b.countInStock !== 0) return 1
                  if (a.countInStock !== 0 && b.countInStock === 0) return -1
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
              textButton={isFetching ? 'Tải thêm' : 'Xem thêm'}
              type="outlined"
              styleButton={{
                border: '1px solid #f9f9fd',
                color: `${data?.total === data?.data?.length ? '#ccc' : '#f9f9fd'}`,
                cursor: `${data?.total === data?.data?.length ? 'not-allowed' : 'pointer'}`,
                width: '240px',
                height: '38px',
                borderRadius: '4px'
              }}
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
