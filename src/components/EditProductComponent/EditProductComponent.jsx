import { Button, Form, Select } from 'antd'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import { StarFilled, UploadOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useSelector } from 'react-redux'
import { error, success } from '../Message/Message'
import { useLocation } from 'react-router-dom'
import TextArea from 'antd/es/input/TextArea'
function EditProductComponent() {
  const queryClient = useQueryClient()
  const location = useLocation()
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const rowSelected = location.pathname.split('/').pop()
  const user = useSelector((state) => state?.user)
  const [form] = Form.useForm()
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    discount: '',
    image: '',
    type: '',
    countInStock: ''
  })
  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data
    const res = ProductService.updateProduct(id, token, rests.data)
    return res
  })
  const {
    data: updatedData,
    isPending: isLoadingUpdate,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated
  } = mutationUpdate

  // const handleOnCloseDrawer = () => {
  //   setStateProductDetails({
  //     name: '',
  //     price: '',
  //     description: '',
  //     rating: '',
  //     image: '',
  //     type: '',
  //     countInStock: ''
  //   })
  //   form.resetFields()
  // }
  const fetchGetProductDetails = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount
      })
    }
    setIsPendingUpdate(false)
    // return res
  }
  useEffect(() => {
    form.setFieldsValue(stateProductDetails)
  }, [form, stateProductDetails])
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)

      fetchGetProductDetails(rowSelected)
    }
  }, [rowSelected])
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, data: stateProductDetails },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['products']) // Làm mới dữ liệu bảng sản phẩm
        }
      }
    )
  }
  useEffect(() => {
    if (isSuccessUpdated && updatedData?.status === 'OK') {
      success()
      // handleOnCloseDrawer()
    } else if (isErrorUpdated) {
      error()
    }
  }, [isSuccessUpdated])
  const onFinishFailed = () => {
    error('Bạn phải nhập đầy đủ thông tin sản phẩm')
  }
  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setStateProductDetails({
          ...stateProductDetails,
          image: preview
        })
      },
      error(err) {
        console.error(err.message)
      }
    })
  }
  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleChangeRating = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      rating: value
    })
  }
  const renderStar = (rating) => {
    return (
      <div>
        {rating} <StarFilled style={{ color: 'yellow' }} />
      </div>
    )
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', color: 'red', fontSize: '1.7rem' }}>
        <h1>Chỉnh sửa sản phẩm</h1>
      </div>
      <Loading isLoading={isPendingUpdate || isLoadingUpdate}>
        <Form
          name="basic"
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 18
          }}
          style={{
            maxWidth: 1200
          }}
          onFinish={onUpdateProduct}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input product name!'
              }
            ]}
          >
            <InputComponent name="name" value={stateProductDetails.name} onChange={handleOnChangeDetails} />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: 'Please input product type!'
              }
            ]}
          >
            <InputComponent name="type" value={stateProductDetails.type} onChange={handleOnChangeDetails} />
          </Form.Item>

          <Form.Item
            label="Count in stock"
            name="countInStock"
            rules={[
              {
                required: true,
                message: 'Please input product countInStock!'
              }
            ]}
          >
            <InputComponent
              name="countInStock"
              value={stateProductDetails.countInStock}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: 'Please input product price!'
              }
            ]}
          >
            <InputComponent name="price" value={stateProductDetails.price} onChange={handleOnChangeDetails} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please input product description!'
              }
            ]}
          >
            <TextArea
              name="description"
              style={{ height: '200px', border: '2px solid #000' }}
              value={stateProductDetails.description}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>
          <Form.Item
            label="Rating"
            name="rating"
            rules={[
              {
                required: true,
                message: 'Please input product rating!'
              }
            ]}
          >
            <Select
              style={{
                width: 120,
                border: '2px solid #000',
                borderRadius: '8px'
              }}
              name="rating"
              value={stateProductDetails.rating}
              onChange={handleChangeRating}
              options={[
                {
                  value: '1',
                  label: renderStar(1)
                },
                {
                  value: '2',
                  label: renderStar(2)
                },
                {
                  value: '3',
                  label: renderStar(3)
                },
                {
                  value: '4',
                  label: renderStar(4)
                },
                {
                  value: '5',
                  label: renderStar(5)
                }
              ]}
            />
            {/* <InputComponent name="rating" value={stateProductDetails.rating} onChange={handleOnChangeDetails} /> */}
          </Form.Item>
          <Form.Item
            label="Discount"
            name="discount"
            rules={[
              {
                required: true,
                message: 'Please input product discount!'
              }
            ]}
          >
            <InputComponent name="discount" value={stateProductDetails.discount} onChange={handleOnChangeDetails} />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: 'Please choose product image!'
              }
            ]}
          >
            <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
              <Button icon={<UploadOutlined />} style={{ marginRight: '10px' }}>
                Select file
              </Button>
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item label="Preview Image">
            {stateProductDetails?.image && (
              <img
                src={stateProductDetails?.image}
                style={{
                  height: '200px',
                  width: '200px',
                  objectFit: 'cover'
                }}
                alt="avatar"
              />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 13,
              span: 16
            }}
          >
            <Button style={{ padding: '20px 100px' }} type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  )
}

export default EditProductComponent
