import { Col, Image, Rate, Row } from 'antd'
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQuantityProduct,
  WrapperStyleNameProduct,
  WrapperStyleTextSell
} from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slices/orderSlice'
import { convertPrice } from '../../utils'

function ProductDetailComponent({ idProduct }) {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispath = useDispatch()

  const [numProduct, setNumProduct] = useState(1)
  const onChange = (e) => {
    setNumProduct(Number(e.target.value))
  }
  const fetchGetProductDetails = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }
  const {
    isPending,
    data: productDetails,
    isFetching
  } = useQuery({
    queryKey: ['products-details', idProduct],
    queryFn: fetchGetProductDetails,
    enabled: !!idProduct
  })

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct(numProduct + 1)
    } else {
      if (numProduct === 1) {
        return
      } else {
        setNumProduct(numProduct - 1)
      }
    }
  }

  console.log(productDetails)
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location.pathname })
    } else {
      // {
      //   name: { type: String, required: true, unique: true },
      //   amount: { type: Number, required: true },
      //   image: { type: String, required: true },
      //   price: { type: Number, required: true },
      //   product: {
      //     type: mongoose.Schema.Types.ObjectId,
      //     ref: 'Product',
      //     required: true
      //   }
      // }
      dispath(
        addOrderProduct({
          orderItems: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount
          }
        })
      )
    }
  }

  return (
    <Loading isLoading={isPending}>
      <Row style={{ padding: '16px', backgroundColor: '#fff' }}>
        <Col span={10} style={{ paddingRight: '10px' }}>
          <Image src={productDetails?.image} alt="Image product" preview={false} />
          <Row style={{ paddingTop: '10px' }}>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
            <Col span={4}>
              <Image src={productDetails?.image} alt="Image small" preview={true} />
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate disabled value={productDetails?.rating} style={{ fontSize: '12px', color: 'rgb(251,216,54' }} />
            <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>

          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user.address}</span> -<span className="change_address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px' }}>
            <div style={{ marginBottom: '6px' }}>Số lượng</div>
            <WrapperQuantityProduct>
              <button
                onClick={() => handleChangeCount('decrease')}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <MinusOutlined style={{ fontSize: '20px' }} size="14px" />
              </button>
              <WrapperInputNumber onChange={onChange} min={1} value={numProduct} size="small" />
              <button
                onClick={() => handleChangeCount('increase')}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <PlusOutlined style={{ fontSize: '20px' }} size="14px" />
              </button>
            </WrapperQuantityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ButtonComponent
              size={40}
              styleButton={{
                backgroundColor: 'rgb(255,57,69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px'
              }}
              textButton="Chọn mua"
              onClick={handleAddOrderProduct}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}
            />
            <ButtonComponent
              size={40}
              styleButton={{
                backgroundColor: 'transparent',
                height: '48px',
                width: '220px',
                border: '1px solid rgb(13, 92, 182)',
                borderRadius: '4px'
              }}
              textButton="Mua trả sau"
              styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
            />
          </div>
        </Col>
      </Row>
    </Loading>
  )
}

export default ProductDetailComponent
