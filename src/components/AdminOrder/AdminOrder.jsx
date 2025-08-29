import { Button, Space } from 'antd'
import { WrapperHeader } from './style'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import LineChartComponent from '../ChartComponent/LineChartComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { error, success } from '../Message/Message'

import Loading from '../LoadingComponent/Loading'
import { useMutationHook } from '../../hooks/useMutationHook'

function AdminOrder() {
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  // const [searchText, setSearchText] = useState('')
  // const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [rowSelected, setRowSelected] = useState('')
  const user = useSelector((state) => state?.user)
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrderForAdmin(user?.access_token)
    return res
  }

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrder
  })
  const { isPending: isLoading, data: orders } = queryOrder
  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data
    const res = OrderService.cancelOrder(id, token)
    return res
  })

  const {
    data: deletedData,
    isPending: isLoadingDelete,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted
  } = mutationDelete

  const handleDelete = () => {
    setIsModalOpenDelete(true)
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  useEffect(() => {
    if (isSuccessDeleted && deletedData?.status === 'OK') {
      success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      error()
    }
  }, [isSuccessDeleted])
  const handleDeleteOrder = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryOrder.refetch()
        }
      }
    )
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={handleDelete} />
      </div>
    )
  }
  const handleSearch = (selectedKeys, confirm) => {
    confirm()
    // setSearchText(selectedKeys[0])
    // setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    // setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      }
    }
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   )
  })

  const columns = [
    {
      title: 'User name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address - b.address,
      ...getColumnSearchProps('address')
    },
    {
      title: 'City',
      dataIndex: 'city',
      sorter: (a, b) => a.city.length - b.city.length,
      ...getColumnSearchProps('city')
    },
    {
      title: 'Order Items',
      dataIndex: 'orderItems',
      render: (items) => (
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          {items.map((item, index) => (
            <li key={index}>
              <span style={{ color: '#FF5733', fontWeight: 'bold' }}>{item.name}</span> - {item.amount}
            </li>
          ))}
        </ul>
      )
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnSearchProps('totalPrice')
    },
    {
      title: 'Payment method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod')
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      ...getColumnSearchProps('createdAt')
    },
    {
      title: 'Paid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid - b.isPaid,
      ...getColumnSearchProps('isPaid')
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveredAt',
      sorter: (a, b) => new Date(a.deliveredAt) - new Date(b.deliveredAt),
      ...getColumnSearchProps('deliveredAt')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => renderAction(record)
    }
  ]
  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
    return date.toLocaleString('vi-VN') // Sử dụng "vi-VN" cho định dạng Việt Nam
  }
  const dataTable = orders?.data?.map((order) => {
    const filteredData = order.orderItems.map(({ name, amount }) => ({ name, amount }))
    return {
      ...order,
      name: order?.shippingAddress.fullName,
      createdAt: formatDate(order.createdAt),
      deliveredAt: order.deliveredAt ? formatDate(order.deliveredAt) : 'Chưa giao hàng',
      isPaid: order.isPaid === true ? 'Đã thanh toán' : 'Chưa thanh toán',
      orderItems: filteredData,
      totalPrice: order?.totalPrice,
      paymentMethod: order?.paymentMethod,
      phone: order?.shippingAddress?.phone,
      address: order?.shippingAddress?.address,
      city: order?.shippingAddress?.city,
      key: order._id
    }
  })

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

      <div style={{ marginTop: '20px' }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          isLoading={isLoading}
          onRow={(record) => {
            return {
              onClick: () => {
                setRowSelected(record._id)
              }
            }
          }}
        />
      </div>
      <div style={{ height: '500px', width: '100%' }}>
        {orders?.data ? <LineChartComponent data={orders?.data} /> : <p>Chưa có dữ liệu để hiển thị biểu đồ</p>}
      </div>

      <ModalComponent
        title="Xóa người dùng"
        onOk={handleDeleteOrder}
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
      >
        <Loading isLoading={isLoadingDelete}>
          <div>Bạn có chắc xóa sản phẩm này không</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminOrder
