import React from 'react'

export const testting = () => {
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
