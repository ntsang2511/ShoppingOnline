import { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slices/userSlice'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'
import Compressor from 'compressorjs'
function ProfilePage() {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const dispatch = useDispatch()

  const mutation = useMutationHook(async (data) => {
    const { id, access_token, ...rests } = data
    const response = await UserService.updateUser(id, rests, access_token)

    return response
  })
  const { isPending, isSuccess, isError } = mutation
  useEffect(() => {
    setEmail(user?.email)
    setName(user?.name)
    setPhone(user?.phone)
    setAddress(user?.address)
    setAvatar(user?.avatar)
  }, [user])

  useEffect(() => {
    if (isSuccess) {
      message.success()
      handleGetDetailsUser(user?.id, user.access_token)
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)

    dispatch(updateUser({ ...res?.data, access_token: token }))
  }
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleOnChangeName = (e) => {
    setName(e.target.value)
  }
  const handleOnChangePhone = (e) => {
    setPhone(e.target.value)
  }
  const handleOnChangeAddress = (e) => {
    setAddress(e.target.value)
  }
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0]

    new Compressor(file.originFileObj, {
      quality: 0.6, // Điều chỉnh chất lượng ảnh, giá trị từ 0-1
      success: async (compressedFile) => {
        const preview = await getBase64(compressedFile)
        setAvatar(preview)
      },
      error(err) {
        console.error(err.message)
      }
    })
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj)
    // }
    // setAvatar(file.preview)
  }

  const handleUpdate = () => {
    mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
  }
  return (
    <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isLoading={isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>
            <InputForm
              id="name"
              style={{ width: '300px' }}
              handleOnChange={handleOnChangeName}
              value={name}
              placeholder="Nhập tên"
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '4px 6px 6px'
              }}
              textButton="Cập nhật"
              styleTextButton={{ color: '#ff424e', fontSize: '15px', fontWeight: 700 }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              id="email"
              style={{ width: '300px' }}
              handleOnChange={handleOnChangeEmail}
              value={email}
              placeholder="Nhập email"
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '4px 6px 6px'
              }}
              textButton="Cập nhật"
              styleTextButton={{ color: '#ff424e', fontSize: '15px', fontWeight: 700 }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
            <InputForm
              id="phone"
              style={{ width: '300px' }}
              handleOnChange={handleOnChangePhone}
              value={phone}
              placeholder="Nhập số điện thoại"
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '4px 6px 6px'
              }}
              textButton="Cập nhật"
              styleTextButton={{ color: '#ff424e', fontSize: '15px', fontWeight: 700 }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">Address</WrapperLabel>
            <InputForm
              id="address"
              style={{ width: '300px' }}
              handleOnChange={handleOnChangeAddress}
              value={address}
              placeholder="Nhập địa chỉ"
            />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '4px 6px 6px'
              }}
              textButton="Cập nhật"
              styleTextButton={{ color: '#ff424e', fontSize: '15px', fontWeight: 700 }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select file</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: '60px',
                  width: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
                alt="avatar"
              />
            )}
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '30px',
                width: 'fit-content',
                borderRadius: '4px',
                padding: '4px 6px 6px'
              }}
              textButton="Cập nhật"
              styleTextButton={{ color: '#ff424e', fontSize: '15px', fontWeight: 700 }}
            />
          </WrapperInput>
        </WrapperContentProfile>
      </Loading>
    </div>
  )
}

export default ProfilePage
