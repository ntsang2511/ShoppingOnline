import { Button, Form, Select } from 'antd'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import { getBase64, renderOptions } from '../../utils.js'
import { useState } from 'react'
import Compressor from 'compressorjs'
import { UploadOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { error, success } from '../Message/Message'
import { useMutationHook } from '../../hooks/useMutationHook.js'
import TextArea from 'antd/es/input/TextArea.js'
function CreateProductComponent() {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: ''
  })
  const [typeSelect, setTypeSelect] = useState('')
  const resetStateProduct = () => {
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: ''
    })
    form.resetFields()
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const onFinishFailed = () => {
    error('Bạn phải nhập đầy đủ thông tin sản phẩm')
  }
  const mutation = useMutationHook((data) => {
    const { name, price, description, rating, image, type, countInStock, discount } = data
    const res = ProductService.createProduct({ name, price, description, rating, image, type, countInStock, discount })
    return res
  })
  const { data, isPending, isSuccess, isError } = mutation
  const typeProduct = useQuery({
    queryKey: ['type-product'],
    queryFn: fetchAllTypeProduct
  })
  // const onFinish = () => {
  //   const params = {
  //     name: stateProduct.name,
  //     price: stateProduct.price,
  //     description: stateProduct.description,
  //     rating: stateProduct.rating,
  //     image: stateProduct.image,
  //     type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
  //     countInStock: stateProduct.countInStock,
  //     discount: stateProduct.discount
  //   }
  //   mutation.mutate(params, {
  //     // onSettled: () => {
  //     //   queryProduct.refetch()
  //     // }
  //     onSuccess: () => {
  //       console.log(123)
  //       queryClient.invalidateQueries(['products']) // Làm mới dữ liệu bảng sản phẩm
  //     }
  //   })
  //   console.log(isSuccess, data)
  //   if (isSuccess && data?.status === 'OK') {
  //     success('Bạn đã thêm thành công sản phẩm')
  //     resetStateProduct()
  //   } else if (isError) {
  //     onFinishFailed()
  //   }
  // }
  const onFinish = () => {
    setStateProduct((prev) => {
      const updatedState = {
        ...prev,
        type: prev.type === 'add_type' ? prev.newType : prev.type
      }

      mutation.mutate(updatedState, {
        onSuccess: () => {
          queryClient.invalidateQueries(['products'])
          success('Bạn đã thêm thành công sản phẩm')
          resetStateProduct()
        },
        onError: onFinishFailed
      })

      return updatedState // Trả về trạng thái mới
    })
  }
  const handleOnChange = (e) => {
    // setStateProduct({
    //   ...stateProduct,
    //   [e.target.name]: e.target.value
    // })
    form.setFieldsValue({ [e.target.name]: e.target.value }) // Cập nhật giá trị trong form
    setStateProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setStateProduct({
          ...stateProduct,
          image: preview
        })
      },
      error(err) {
        console.error(err.message)
      }
    })
  }
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value
    })
    console.log(stateProduct)
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', color: 'red', fontSize: '1.7rem' }}>
        <h1>Tạo sản phẩm</h1>
      </div>
      <Loading isLoading={isPending}>
        <Form
          name="basic"
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 22
          }}
          style={{
            maxWidth: 1200
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="on"
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
            <InputComponent name="name" value={stateProduct.name} onChange={handleOnChange} />
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
            <Select
              name={typeSelect !== 'add_type' ? 'type' : ''}
              // defaultValue="lucy"
              value={stateProduct.type}
              style={{ border: '2px solid #000', borderRadius: '6px' }}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>

          {stateProduct.type === 'add_type' && (
            <Form.Item
              label="New Type"
              name="newType"
              rules={[
                {
                  required: true,
                  message: 'Please input product type!'
                }
              ]}
            >
              <InputComponent value={stateProduct.newType} onChange={handleOnChange} name="newType" />
            </Form.Item>
          )}

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
            <InputComponent name="countInStock" value={stateProduct.countInStock} onChange={handleOnChange} />
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
            <InputComponent name="price" value={stateProduct.price} onChange={handleOnChange} />
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
              value={stateProduct.description}
              onChange={handleOnChange}
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
            <InputComponent name="rating" value={stateProduct.rating} onChange={handleOnChange} />
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
            <InputComponent name="discount" value={stateProduct.discount} onChange={handleOnChange} />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
            rules={[
              {
                required: true,
                message: 'Please input product image!'
              }
            ]}
          >
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select file</Button>
              {stateProduct.image && (
                <img
                  src={stateProduct.image}
                  style={{
                    height: '60px',
                    width: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  )
}

export default CreateProductComponent
