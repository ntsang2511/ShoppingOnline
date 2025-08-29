import { useState, useEffect } from 'react'
import { Button, Card, Space, Image, Typography, Row, Col, Badge, Form } from 'antd'
import {
  SaveOutlined,
  UploadOutlined,
  CloseOutlined,
  PlusOutlined,
  DollarOutlined,
  FileTextOutlined,
  NumberOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import { useQueryClient } from '@tanstack/react-query'
import Compressor from 'compressorjs'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import { useSelector } from 'react-redux'
import { error, success } from '../Message/Message'
import { useLocation } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const { Title, Text } = Typography

const EditProductComponent = () => {
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
  }

  useEffect(() => {
    form.setFieldsValue({
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      discount: stateProductDetails.discount,
      image: stateProductDetails.image,
      type: stateProductDetails.type,
      countInStock: stateProductDetails.countInStock
    })
  }, [form, stateProductDetails])

  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)
      fetchGetProductDetails(rowSelected)
    }
  }, [rowSelected])

  useEffect(() => {
    if (isSuccessUpdated && updatedData?.status === 'OK') {
      success()
      queryClient.invalidateQueries(['products'])
    } else if (isErrorUpdated) {
      error()
    }
  }, [isSuccessUpdated])

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target?.name]: e.target?.value
    })
  }

  const handleOnChangeDescription = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      description: value
    })
  }

  const handleOnChangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    new Compressor(file.originFileObj, {
      quality: 0.6,
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

  const onFinishFailed = () => {
    error('Bạn phải nhập đầy đủ thông tin sản phẩm')
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
      <Loading isLoading={isPendingUpdate || isLoadingUpdate}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title
                level={2}
                style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 0 }}
              >
                <CodeSandboxOutlined style={{ fontSize: '24px', color: '#FFC107' }} />
                Chỉnh sửa sản phẩm
              </Title>
              <Text style={{ color: '#B3A37C' }}>Cập nhật thông tin sản phẩm đồng hồ</Text>
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
                    fontWeight: '700',
                    padding: '20px 24px'
                  }}
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  form="productForm"
                >
                  Lưu sản phẩm
                </Button>
              </Space>
            </Col>
          </Row>

          <Form
            id="productForm"
            name="basic"
            form={form}
            onFinish={() =>
              mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, data: stateProductDetails })
            }
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Space>
                          <FileTextOutlined style={{ color: '#FFC107' }} />
                          <Title level={3} style={{ color: '#fff', margin: 0 }}>
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
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '11px' }}>Tên sản phẩm</Text>}
                        name="name"
                        rules={[{ required: true, message: 'Please input product name!' }]}
                      >
                        <InputComponent
                          name="name"
                          value={stateProductDetails.name}
                          onChange={handleOnChangeDetails}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '9px' }}>Loại sản phẩm</Text>}
                        name="type"
                        rules={[{ required: true, message: 'Please input product type!' }]}
                      >
                        <InputComponent
                          name="type"
                          value={stateProductDetails.type}
                          onChange={handleOnChangeDetails}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<Text style={{ color: '#fff' }}>Mô tả sản phẩm</Text>}
                        name="description"
                        rules={[{ required: true, message: 'Please input product description!' }]}
                      >
                        <ReactQuill
                          value={stateProductDetails.description}
                          onChange={handleOnChangeDescription}
                          style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                          theme="snow"
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link', 'image'],
                              ['clean']
                            ]
                          }}
                          formats={[
                            'header',
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            'blockquote',
                            'list',
                            'bullet',
                            'link',
                            'image'
                          ]}
                        />
                      </Form.Item>
                      <Form.Item
                        label={<Text style={{ color: '#fff', marginRight: '44px' }}>Giảm giá</Text>}
                        name="discount"
                        rules={[{ required: true, message: 'Please input product discount!' }]}
                      >
                        <InputComponent
                          name="discount"
                          value={stateProductDetails.discount}
                          onChange={handleOnChangeDetails}
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
                          <Title level={4} style={{ color: '#fff', margin: 0 }}>
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
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<Text style={{ color: '#fff' }}>Giá bán VNĐ</Text>}
                            name="price"
                            rules={[{ required: true, message: 'Please input product price!' }]}
                          >
                            <InputComponent
                              type="number"
                              name="price"
                              value={stateProductDetails.price}
                              onChange={handleOnChangeDetails}
                              style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label={<Text style={{ color: '#fff' }}>Số lượng</Text>}
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input product countInStock!' }]}
                          >
                            <InputComponent
                              type="number"
                              name="countInStock"
                              value={stateProductDetails.countInStock}
                              onChange={handleOnChangeDetails}
                              style={{ background: '#252F33', borderColor: '#2E363F', color: '#fff' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={24}>
                          <div
                            style={{
                              padding: '24px',
                              background: '#252F33',
                              border: '1px solid #2E363F',
                              borderRadius: '8px'
                            }}
                          >
                            <Space>
                              <NumberOutlined style={{ color: '#FFC107' }} />
                              <div>
                                <Text style={{ color: '#FFF8A3' }}>Giá hiển thị</Text>
                                <Title level={4} style={{ color: '#FFC107', margin: 0 }}>
                                  {parseInt(stateProductDetails.price || '0').toLocaleString()} VNĐ
                                </Title>
                              </div>
                              <Badge
                                count={`Còn ${stateProductDetails.countInStock} sản phẩm`}
                                style={{ backgroundColor: '#252F33', color: '#FFF8A3', borderColor: '#2E363F' }}
                              />
                            </Space>
                          </div>
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
                          <Title level={4} style={{ color: '#fff', margin: 0 }}>
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
                      <Form.Item name="image" rules={[{ required: true, message: 'Please choose product image!' }]}>
                        <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                          <Button
                            style={{
                              width: '375px',
                              height: '128px',
                              border: '2px dashed #2E363F',
                              background: '#252F33',
                              color: '#B3A37C'
                            }}
                            icon={<PlusOutlined />}
                          >
                            Thêm hình ảnh
                          </Button>
                        </WrapperUploadFile>
                      </Form.Item>
                      {stateProductDetails.image && (
                        <Row gutter={[8, 8]}>
                          <Col span={12}>
                            <div style={{ position: 'relative' }}>
                              <Image
                                src={stateProductDetails.image}
                                alt="Product"
                                style={{
                                  width: '100%',
                                  height: '96px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid #2E363F'
                                }}
                              />
                              <Button
                                type="primary"
                                danger
                                size="small"
                                icon={<CloseOutlined />}
                                style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                                onClick={() => setStateProductDetails({ ...stateProductDetails, image: '' })}
                              />
                            </div>
                          </Col>
                        </Row>
                      )}
                    </Space>
                  </Card>

                  <Card
                    title={
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Space>
                          <Title level={4} style={{ color: '#fff', margin: 0 }}>
                            Xem trước
                          </Title>
                        </Space>
                        <Text style={{ color: '#B3A37C' }}>Sản phẩm sẽ hiển thị như thế này</Text>
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
                      <div
                        style={{
                          aspectRatio: '1/1',
                          background: '#252F33',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #2E363F'
                        }}
                      >
                        {stateProductDetails.image ? (
                          <Image
                            src={stateProductDetails.image}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <UploadOutlined style={{ fontSize: '48px', color: '#B3A37C' }} />
                        )}
                      </div>
                      <div>
                        <Title
                          level={4}
                          style={{
                            color: '#FFF8A3',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {stateProductDetails.name || 'Tên sản phẩm'}
                        </Title>
                        <Text style={{ color: '#B3A37C' }}>{stateProductDetails.type || 'Loại sản phẩm'}</Text>
                        <Title level={4} style={{ color: '#FFC107', margin: '4px 0 0 0' }}>
                          {parseInt(stateProductDetails.price || '0').toLocaleString()} VNĐ
                        </Title>
                      </div>
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

export default EditProductComponent
