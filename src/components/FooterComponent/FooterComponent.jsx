import { Button, Input } from 'antd'
import {
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1C2024', // --card
        borderTop: '1px solid #333A45' // --border
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 16px'
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            padding: '48px 0',
            display: 'grid',
            gap: '32px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
          }}
          className="sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Company Info */}
          <div
            style={{
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
                gap: '8px'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #FFC107, #FFCA28)', // --gradient-luxury
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ClockCircleOutlined style={{ fontSize: '24px', color: '#14171A' }} /> {/* --primary-foreground */}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#FFE8A3' // --foreground
                  }}
                >
                  WATCH SHOP
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#8F9BB3', // --muted-foreground
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  BEST SHOP EVER
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: '#8F9BB3', // --muted-foreground
                lineHeight: '1.5',
                marginBottom: '16px'
              }}
            >
              Chuyên cung cấp đồng hồ cao cấp từ các thương hiệu danh tiếng trên thế giới với chất lượng và dịch vụ tốt
              nhất.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px'
              }}
            >
              <Button
                icon={<FacebookOutlined style={{ fontSize: '30px' }} />}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#8F9BB3', // --muted-foreground
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
              />
              <Button
                icon={<InstagramOutlined style={{ fontSize: '30px' }} />}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#8F9BB3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
              />
              <Button
                icon={<YoutubeOutlined style={{ fontSize: '30px' }} />}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#8F9BB3', // --muted-foreground
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div
            style={{
              marginBottom: '24px'
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#FFE8A3', // --foreground
                marginBottom: '16px',
                marginTop: 0
              }}
            >
              Liên kết nhanh
            </h3>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <li>
                <a
                  href="#"
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
                >
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
                >
                  Sản phẩm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
                >
                  Tin tức
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
                >
                  Chính sách bảo hành
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div
            style={{
              marginBottom: '24px'
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#FFE8A3', // --foreground
                marginBottom: '16px',
                marginTop: 0
              }}
            >
              Thông tin liên hệ
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PhoneOutlined style={{ fontSize: '20px', color: '#FFC107' }} /> {/* --primary */}
                <span
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3' // --muted-foreground
                  }}
                >
                  +84 123 456 789
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MailOutlined style={{ fontSize: '20px', color: '#FFC107' }} /> {/* --primary */}
                <span
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3', // --muted-foreground
                    wordBreak: 'break-all'
                  }}
                >
                  info@watchshop.vn
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}
              >
                <EnvironmentOutlined style={{ fontSize: '20px', color: '#FFC107', marginTop: '2px' }} />{' '}
                {/* --primary */}
                <span
                  style={{
                    fontSize: '14px',
                    color: '#8F9BB3' // --muted-foreground
                  }}
                >
                  123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div
            style={{
              marginBottom: '24px'
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#FFE8A3',
                marginBottom: '16px',
                marginTop: 0
              }}
            >
              Đăng ký nhận tin
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#8F9BB3', // --muted-foreground
                marginBottom: '16px'
              }}
            >
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <Input
                placeholder="Email của bạn"
                style={{
                  backgroundColor: '#14171A', // --background
                  border: '1px solid #333A45', // --border
                  color: '#FFE8A3', // --foreground
                  fontSize: '14px',
                  padding: '8px',
                  borderRadius: '4px'
                }}
              />
              <Button
                style={{
                  width: '100%',
                  backgroundColor: '#FFC107', // --primary
                  color: '#14171A', // --primary-foreground
                  border: 'none',
                  fontSize: '14px',
                  padding: '8px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFB300')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFC107')}
              >
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div
          style={{
            padding: '16px 0',
            borderTop: '1px solid #333A45', // --border
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#8F9BB3' // --muted-foreground
            }}
          >
            © 2024 Watch Shop. Tất cả quyền được bảo lưu.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '12px'
            }}
          >
            <a
              href="#"
              style={{
                color: '#8F9BB3', // --muted-foreground
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
            >
              Điều khoản sử dụng
            </a>
            <a
              href="#"
              style={{
                color: '#8F9BB3', // --muted-foreground
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              style={{
                color: '#8F9BB3', // --muted-foreground
                textDecoration: 'none',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFC107')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8F9BB3')}
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
