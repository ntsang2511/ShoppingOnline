import { Col, Pagination, Row } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import { WrapperNavbar } from './style'

function TypeProductPage() {
  const onChange = () => {}
  return (
    <div style={{ padding: '0 120px', backgroundColor: '#efefef' }}>
      <Row style={{ flexWrap: 'nowrap', paddingtop: '10px' }}>
        <WrapperNavbar span={4}>
          <NavbarComponent />
        </WrapperNavbar>
        <Col
          span={20}
          style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}
        >
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </Col>
      </Row>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination showQuickJumper defaultCurrent={2} total={100} onChange={onChange} />
      </div>
    </div>
  )
}

export default TypeProductPage
