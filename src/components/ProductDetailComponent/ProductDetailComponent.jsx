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
import { useMutationHook } from '../../hooks/useMutationHook'
import * as CartService from '../../services/CartService'
function ProductDetailComponent({ idProduct }) {
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const [numProduct, setNumProduct] = useState(1)

  const mutation = useMutationHook((data) => {
    const res = CartService.addItemCart(data)
    return res
  })

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

  const handleChangeCount = (type, countInStock) => {
    if (type === 'increase') {
      if (numProduct < countInStock) {
        setNumProduct(numProduct + 1)
      } else if (numProduct === countInStock) {
        return
      }
    } else {
      if (numProduct <= 1) {
        return
      } else {
        setNumProduct(numProduct - 1)
      }
    }
  }

  const { data, isPending: isPendingCart, isSuccess, isError } = mutation

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location.pathname })
    } else {
      dispatch(
        addOrderProduct({
          orderItems: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock
          }
        })
      )
      mutation.mutate({
        name: productDetails?.name,
        amount: numProduct,
        image: productDetails?.image,
        price: productDetails?.price,
        product: productDetails?._id,
        discount: productDetails?.discount,
        countInStock: productDetails?.countInStock,
        userId: user?.id
      })
    }
  }

  const parseDescription = (text) => {
    // Tách đoạn văn bản dựa trên dấu `##`
    const lines = text.split('\n').filter((line) => line.trim() !== '')
    return lines.map((line, index) => {
      if (line.startsWith('##')) {
        // Nếu dòng bắt đầu bằng `##`, trả về nội dung in đậm
        return (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', fontSize: '2rem', color: '#fff' }}>
            <h3 style={{ display: 'block', marginBottom: '8px' }}>{line.replace('##', '')}</h3>
          </div>
        )
      }
      // Các dòng khác sẽ là nội dung bình thường
      return (
        <p key={index} style={{ marginBottom: '8px', fontSize: '1.5rem', color: '#fff' }}>
          {line}
        </p>
      )
    })
  }

  console.log('data', data)
  return (
    <Loading isLoading={isPending || isFetching}>
      <Row style={{ padding: '16px', backgroundColor: '#333' }}>
        <Col span={10} style={{ paddingRight: '10px' }}>
          <Image src={productDetails?.image} alt="Image product" preview={true} />
        </Col>
        <Col span={14}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate disabled value={productDetails?.rating} style={{ fontSize: '12px', color: 'rgb(251,216,54)' }} />
            <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0}</WrapperStyleTextSell>
          </div>
          <div style={{ marginTop: '10px' }}>
            {productDetails?.countInStock === 0 || numProduct === productDetails?.countInStock ? (
              <span style={{ color: 'red' }}>Sản phẩm đã hết hàng</span>
            ) : (
              <span style={{ color: 'green' }}>Số lượng còn lại: {productDetails?.countInStock}</span>
            )}
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>

          <WrapperAddressProduct>
            <span style={{ color: '#fff' }}>Giao đến </span>
            <span className="address">{user.address}</span> -<span className="change_address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: '10px 0 20px' }}>
            <div style={{ marginBottom: '6px', color: '#fff' }}>Số lượng</div>
            <WrapperQuantityProduct>
              <button
                onClick={() => handleChangeCount('decrease', productDetails?.countInStock)}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <MinusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
              </button>
              <WrapperInputNumber onChange={onChange} min={1} value={numProduct} size="small" />
              <button
                onClick={() => handleChangeCount('increase', productDetails?.countInStock)}
                style={{ border: 'none', backgroundColor: 'transparent' }}
              >
                <PlusOutlined style={{ fontSize: '20px', color: '#fff' }} size="14px" />
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
              disabled={productDetails?.countInStock === 0}
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
      <div style={{ padding: '16px', backgroundColor: '#333' }}>
        <div style={{ color: 'red', fontSize: '3rem' }}>Thông tin mô tả</div>
        {isPending || isFetching ? (
          <p style={{ fontSize: '2rem', color: '#999' }}>Đang tải thông tin mô tả...</p>
        ) : (
          parseDescription(productDetails?.description)
        )}
      </div>
    </Loading>
  )
}

export default ProductDetailComponent
