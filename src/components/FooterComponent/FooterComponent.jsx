import { FacebookFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons'

function FooterComponent() {
  return (
    <div
      style={{
        backgroundColor: '#1c1c1c',
        color: '#fff',
        padding: '40px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        fontSize: '14px',
        lineHeight: 1.8
      }}
    >
      {/* Thông tin liên hệ */}
      <div style={{ marginLeft: '80px' }}>
        <h3 style={{ color: '#ff4d4f' }}>Thông tin liên hệ</h3>
        <p style={{ fontWeight: 'bold', color: '#ff4d4f' }}>CÔNG TY PHÂN PHỐI SẢN PHẨM CAO CẤP WATCH SHOP</p>
        <p>HOTLINE: 123456789</p>
        <p>Email: nts25112003@gmail.com</p>
      </div>

      {/* Đơn vị vận chuyển + Thanh toán */}
      <div style={{ marginLeft: '80px' }}>
        <h3 style={{ color: '#ff4d4f' }}>Đơn vị vận chuyển</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzgqJDFb04y7L_t3oG_LbVfov-anWOrlclIg&s"
            alt="gojek"
            style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '6px' }}
          />
          <img
            src="https://variety.com/wp-content/uploads/2016/05/netflix-fast-com.jpg?w=640&h=351&crop=1"
            alt="fast"
            style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '6px' }}
          />
        </div>

        <h3 style={{ color: '#ff4d4f' }}>Thanh toán</h3>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcKD3oWVK-z3NhPCW9ldja6bLkmokAyk-JkA&s"
          alt="zalo"
          style={{ width: '60px', height: '60px', backgroundColor: '#fff', borderRadius: '6px' }}
        />
      </div>

      {/* Theo dõi chúng tôi */}
      <div style={{ marginLeft: '80px' }}>
        <h3 style={{ color: '#ff4d4f' }}>Theo dõi chúng tôi</h3>
        <div style={{ display: 'flex', gap: '15px', fontSize: '24px' }}>
          <div style={{ display: 'flex' }}>
            <a href="https://www.facebook.com/nguyen.tan.sang.117983" style={{ marginRight: '20px' }}>
              <FacebookFilled style={{ fontSize: '5rem', color: '#4267b2', backgroundColor: '#E9EBEE' }} />
            </a>
            <a href="https://www.instagram.com/_sang2003_/?hl=en" style={{ marginRight: '20px' }}>
              <InstagramFilled style={{ color: '#E95950', fontSize: '5rem' }} />
            </a>
            <a href="https://www.linkedin.com/in/sang-nguyen-2511d/">
              <LinkedinFilled style={{ color: '#0072b1 ', backgroundColor: '#fff', fontSize: '5rem' }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterComponent
