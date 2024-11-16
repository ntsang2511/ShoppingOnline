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
function HomePage() {
  const mockData = ['TV', 'Tủ lạnh', 'Lap top']
  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }
  const { isLoading, data } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductAll,
    retry: 3
  })

  return (
    <>
      <div style={{ padding: '0 120px' }}>
        <WrapperTypeProduct>
          {mockData.map((item, index) => {
            return <TypeProduct name={item} key={index} />
          })}
        </WrapperTypeProduct>
        <div id="container" style={{ backgroundColor: '#efefef' }}>
          <SliderComponent arrImages={[slide3, slide4, slide5]} />
          <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {isLoading ? (
              <p>Loading</p>
            ) : (
              data?.data?.map((product) => {
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
                  />
                )
              })
            )}
          </div>
          <WrapperProducts>
            <ButtonComponent
              textButton="Xem thêm"
              type="outlined"
              styleButton={{
                border: '1px solid rgb(11,116,229)',
                color: 'rgb(11,116,229)',
                width: '240px',
                height: '38px',
                borderRadius: '4px'
              }}
              styleTextButton={{ fontWeight: 500 }}
            />
          </WrapperProducts>
        </div>
      </div>
    </>
  )
}

export default HomePage
