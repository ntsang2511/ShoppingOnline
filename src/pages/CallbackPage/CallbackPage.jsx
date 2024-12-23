import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const CallbackPage = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('resultCode') // Lấy trạng thái thanh toán
    if (status === '0') {
      alert('Thanh toán thành công!')
    } else {
      alert('Thanh toán thất bại!')
    }
  }, [searchParams])

  return <div>Đang xử lý kết quả thanh toán...</div>
}

export default CallbackPage
