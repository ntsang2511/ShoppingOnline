import { Button, Form, Row, Col, Card, Space, Typography } from 'antd'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { StyledSelect, WrapperUploadFile } from './style'
import { getBase64, renderOptions } from '../../utils.js'
import { useState } from 'react'
import Compressor from 'compressorjs'
import {
  UploadOutlined,
  SaveOutlined,
  CloseOutlined,
  FileTextOutlined,
  DollarOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { error, success } from '../Message/Message'
import { useMutationHook } from '../../hooks/useMutationHook.js'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

const { Title, Text } = Typography

function CreateProductComponent() {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '0', // Mặc định rating là 0
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: ''
  })
  const typeSelect = ''
  const resetStateProduct = () => {
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '0', // Reset rating về 0
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
  const { isPending } = mutation
  const typeProduct = useQuery({
    queryKey: ['type-product'],
    queryFn: fetchAllTypeProduct
  })
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
    form.setFieldsValue({ [e.target.name]: e.target.value }) // Cập nhật giá trị trong form
    setStateProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  const handleChangeDescription = (content) => {
    setStateProduct((prev) => ({
      ...prev,
      description: content
    }))
    form.setFieldsValue({ description: content })
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
  }

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }
  return (
    <div style={{ padding: '24px', background: '#1a1a1a', marginLeft: '5%', marginRight: '5%' }}>
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="marginLeft: 5%"] {
              margin-left: 2%;
              margin-right: 2%;
            }
          }
          @media (max-width: 480px) {
            div[style*="marginLeft: 5%"] {
              margin-left: 0;
              margin-right: 0;
            }
          }
        `}
      </style>
      <Loading isLoading={isPending}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ color: '#FFF8A3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CodeSandboxOutlined style={{ fontSize: '24px', color: '#FFC107' }} />
                Tạo sản phẩm
              </Title>
              <Text style={{ color: '#B3A37C' }}>Tạo mới thông tin sản phẩm đồng hồ</Text>
            </Col>
            <Col>
              <Space>
                <Button
                  style={{ borderColor: '#2E363F', color: '#FFF8A3', background: '#252F33', padding: '20px 24px' }}
                  icon={<CloseOutlined />}
                >
                  Hủy
                </Button>
                <Button
                  style={{
                    background: 'linear-gradient(135deg, #FFC107, #E6A306)',
                    color: '#1D2528',
                    padding: '20px 24px'
                  }}
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  form="basic"
                >
                  Lưu sản phẩm
                </Button>
              </Space>
            </Col>
          </Row>

          <Form
            id="basic"
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 22 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            form={form}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Space>
                          <FileTextOutlined style={{ color: '#FFC107' }} />
                          <Title level={3} style={{ color: '#FFF8A3', margin: 0 }}>
                            Thông tin cơ bản
                          </Title>
                        </Space>
                        <Text style={{ color: '#B3A37C' }}>Nhập thông tin cơ bản của sản phẩm đồng hồ</Text>
                      </div>
                    }
                    style={{
                      background: '#21282B',
                      borderColor: '#2E363F',
                      boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.4)',
                      paddingTop: '24px'
                    }}
                  >
                    <Space direction="vertical" size="large">
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '11px' }}>Tên sản phẩm</Text>}
                        name="name"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                      >
                        <InputComponent
                          name="name"
                          value={stateProduct.name}
                          onChange={handleOnChange}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '9px' }}>Loại sản phẩm</Text>}
                        name="type"
                        rules={[{ required: true, message: 'Please input product type!' }]}
                      >
                        <StyledSelect
                          name={typeSelect !== 'add_type' ? 'type' : ''}
                          value={stateProduct.type}
                          style={{
                            border: '2px solid #2E363F',
                            borderRadius: '6px',
                            background: '#252F33 !important',
                            '& .ant-select-selector': {
                              background: '#252F33 !important'
                            },
                            color: '#fff'
                          }}
                          onChange={handleChangeSelect}
                          options={renderOptions(typeProduct?.data?.data)}
                        />
                      </Form.Item>
                      {stateProduct.type === 'add_type' && (
                        <Form.Item
                          label={<Text style={{ color: '#fff', marginRight: '11px' }}>New Type</Text>}
                          name="newType"
                          rules={[{ required: true, message: 'Please input product type!' }]}
                        >
                          <InputComponent
                            value={stateProduct.newType}
                            onChange={handleOnChange}
                            name="newType"
                            style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        label={<Text style={{ color: '#fff' }}>Mô tả sản phẩm</Text>}
                        name="description"
                        rules={[{ required: true, message: 'Please input product description!' }]}
                      >
                        <ReactQuill
                          value={stateProduct.description}
                          onChange={handleChangeDescription}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                          theme="snow"
                          modules={modules}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '44px' }}>Giảm giá</Text>}
                        name="discount"
                        rules={[{ required: true, message: 'Please input product discount!' }]}
                      >
                        <InputComponent
                          name="discount"
                          value={stateProduct.discount}
                          onChange={handleOnChange}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                        />
                      </Form.Item>
                    </Space>
                  </Card>

                  <Card
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Space>
                          <DollarOutlined style={{ color: '#FFC107' }} />
                          <Title level={4} style={{ color: '#FFF8A3', margin: 0 }}>
                            Giá & Kho hàng
                          </Title>
                        </Space>
                        <Text style={{ color: '#B3A37C' }}>Thiết lập giá bán và quản lý số lượng tồn kho</Text>
                      </div>
                    }
                    style={{
                      background: '#21282B',
                      borderColor: '#2E363F',
                      boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.4)',
                      paddingTop: '24px'
                    }}
                  >
                    <Space direction="horizontal" size="middle" style={{ width: '100%' }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={24}>
                          <Form.Item
                            label={<Text style={{ color: '#fff' }}>Giá bán VNĐ</Text>}
                            name="price"
                            rules={[{ required: true, message: 'Please input product price!' }]}
                          >
                            <InputComponent
                              type="number"
                              name="price"
                              value={stateProduct.price}
                              onChange={handleOnChange}
                              style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                          <Form.Item
                            label={<Text style={{ color: '#fff' }}>Số lượng</Text>}
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input product countInStock!' }]}
                          >
                            <InputComponent
                              type="number"
                              name="countInStock"
                              value={stateProduct.countInStock}
                              onChange={handleOnChange}
                              style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                </Space>
              </Col>

              <Col xs={24} lg={8}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Space>
                          <UploadOutlined style={{ color: '#FFC107' }} />
                          <Title level={4} style={{ color: '#FFF8A3', margin: 0 }}>
                            Hình ảnh sản phẩm
                          </Title>
                        </Space>
                        <Text style={{ color: '#B3A37C' }}>Thêm hình ảnh để hiển thị sản phẩm</Text>
                      </div>
                    }
                    style={{
                      background: '#21282B',
                      borderColor: '#2E363F',
                      boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.4)',
                      padding: '24px 0'
                    }}
                  >
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Form.Item name="image" rules={[{ required: true, message: 'Please input product image!' }]}>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                          <Button
                            style={{
                              width: '375px',
                              height: '128px',
                              border: '2px dashed #2E363F',
                              background: '#252F33',
                              color: '#B3A37C'
                            }}
                            icon={<UploadOutlined />}
                          >
                            Select file
                          </Button>
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
                    </Space>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Form>
        </Space>
      </Loading>
    </div>
  )
}

export default CreateProductComponent
