import { useEffect, useState } from 'react'

export const useDebounce = (value, deplay) => {
  const [valueDebounce, setValueDebounce] = useState('')
  useEffect(() => {
    const handle = setTimeout(() => {
      setValueDebounce(value)
    }, [deplay])
    return () => {
      clearTimeout(handle)
    }
  }, [value])
  return valueDebounce
}
