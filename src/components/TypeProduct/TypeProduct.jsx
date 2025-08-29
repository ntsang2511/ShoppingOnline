import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function TypeProduct({ name }) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

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
    <Button
      type="text"
      style={{
        // border: '1px solid #fff',
        background: isHovered ? '#ffd350' : '#1a1a1a',
        color: isHovered ? '#1a1a1a' : '#ffd350',
        fontSize: '16px',
        fontWeight: '700',
        transition: 'color 0.3s',
        textTransform: 'uppercase',
        padding: '20px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </Button>
  )
}

export default TypeProduct
