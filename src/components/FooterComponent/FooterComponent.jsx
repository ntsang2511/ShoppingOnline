import { FacebookFilled, InstagramFilled, TikTokFilled } from '@ant-design/icons'
function FooterComponent() {
  return (
    <div
      style={{
        color: 'white',
        backgroundColor: '#333',
        paddingTop: '2000px',
        display: 'flex',
        justifyContent: 'space-around'
      }}
    >
      <div span={8}>
        <h3 style={{ color: '#ff424e' }}>Thông tin liên hệ</h3>
        <span style={{ fontSize: '1.7rem', fontWeight: 'bold', color: '#ff424e' }}>
          CÔNG TY PHÂN PHỐI SẢN PHẨM CAO CẤP WATCH SHOP
        </span>
        <br />
        <span>HOTLINE: 123456789</span>
        <br />
        <span>Email: testing1234@gmail.com</span>
      </div>
      <div span={8}>
        <h3 style={{ color: '#ff424e' }}>Đơn vị vận chuyển</h3>

        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '10px' }}>
            <img
              style={{ width: '50px', height: '50px' }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzgqJDFb04y7L_t3oG_LbVfov-anWOrlclIg&s"
              alt=""
            />
          </div>
          <div>
            <img
              style={{ width: '50px', height: '50px' }}
              src="https://variety.com/wp-content/uploads/2016/05/netflix-fast-com.jpg?w=640&h=351&crop=1"
              alt=""
            />
          </div>
        </div>

        <div>
          <h3 style={{ color: '#ff424e' }}>Thanh toán</h3>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '10px' }}>
              <img
                style={{ width: '50px', height: '50px' }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcKD3oWVK-z3NhPCW9ldja6bLkmokAyk-JkA&s"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div span={8}>
        <h3 style={{ color: '#ff424e' }}>Theo dõi chúng tôi</h3>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px' }}>
            <FacebookFilled style={{ fontSize: '5rem', color: '#4267b2', backgroundColor: '#E9EBEE' }} />
          </div>
          <div style={{ marginRight: '20px' }}>
            <InstagramFilled style={{ color: '#E95950', fontSize: '5rem' }} />
          </div>
          <div>
            <TikTokFilled style={{ color: '#000000', backgroundColor: '#fff', fontSize: '5rem' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterComponent
