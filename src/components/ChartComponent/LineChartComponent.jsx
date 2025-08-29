import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
function LineChartComponent({ data }) {
  if (!data || data.length === 0) {
    return <p>Không có dữ liệu để hiển thị biểu đồ</p>
  }

  // Bước 1: Gom tổng tiền theo ngày
  const revenueByDate = data.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split('T')[0] // YYYY-MM-DD
    acc[date] = (acc[date] || 0) + order.totalPrice
    return acc
  }, {})

  // Bước 2: Chuyển object thành mảng
  const chartData = Object.keys(revenueByDate).map((date) => ({
    date, // Định dạng ngày
    totalRevenue: revenueByDate[date] // Tổng tiền trong ngày đó
  }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineChartComponent
