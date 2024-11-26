import { useNavigate } from 'react-router-dom'

function TypeProduct({ name }) {
  const navigate = useNavigate()
  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')}`,
      { state: type }
    )
  }
  return (
    <div style={{ fontSize: '1.4rem', padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigateType(name)}>
      {name}
    </div>
  )
}

export default TypeProduct
