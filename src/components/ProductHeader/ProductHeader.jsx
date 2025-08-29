import { Select, Space } from 'antd'
import { SortAscendingOutlined } from '@ant-design/icons'
import { Container, Title, Description, Highlight, SelectWrapper } from './style'

const ProductHeader = ({ totalProducts, onSortChange }) => {
  const options = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ]

  return (
    <Container>
      <div>
        <Title>Tất cả sản phẩm</Title>
        <Description>
          Hiển thị <Highlight>{totalProducts}</Highlight> sản phẩm
        </Description>
      </div>

      <Space size="middle">
        {/* Sort */}
        <Space>
          <SortAscendingOutlined style={{ color: '#B3B3B3', fontSize: '16px' }} />
          <SelectWrapper>
            <Select
              defaultValue="newest"
              options={options}
              dropdownStyle={{ backgroundColor: '#fff' }}
              onChange={onSortChange}
            />
          </SelectWrapper>
        </Space>
      </Space>
    </Container>
  )
}

export default ProductHeader
