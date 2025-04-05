import { Table } from 'antd'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { Excel } from 'antd-table-saveas-excel'
function TableComponent({
  columns = [],
  selectionType = 'checkbox',
  data = [],
  isLoading = false,
  handleDeleteMany,
  ...props
}) {
  const [rowSelectedKey, setRowSelectedKey] = useState([])
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKey(selectedRowKeys)
    }
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name
    // })
  }
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey)
  }
  const exportExcel = () => {
    const excel = new Excel()

    // Lọc các cột cần xuất
    const exportableColumns = columns
      .filter(
        (col) => col.dataIndex && col.dataIndex !== 'action' && col.dataIndex !== 'image' && col.dataIndex !== 'avatar'
      )
      .map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex
      }))

    // Chuyển đổi dữ liệu trước khi xuất
    const exportableData = data.map((row) => {
      const newRow = {}
      exportableColumns.forEach((col) => {
        if (Array.isArray(row[col.dataIndex])) {
          // Nếu giá trị là mảng, chuyển thành chuỗi JSON hoặc danh sách có thể đọc
          newRow[col.dataIndex] = row[col.dataIndex].map((item) => JSON.stringify(item)).join(', ')
        } else if (typeof row[col.dataIndex] === 'object' && row[col.dataIndex] !== null) {
          // Nếu giá trị là object, chuyển thành chuỗi JSON
          newRow[col.dataIndex] = JSON.stringify(row[col.dataIndex])
        } else {
          newRow[col.dataIndex] = row[col.dataIndex]
        }
      })
      return newRow
    })

    // Xuất file Excel
    excel
      .addSheet('Table Data')
      .addColumns(exportableColumns)
      .addDataSource(exportableData, {
        str2Percent: true
      })
      .saveAs('TableData.xlsx')
  }

  return (
    <div>
      <Loading isLoading={isLoading}>
        {rowSelectedKey.length > 0 && (
          <div
            style={{
              background: '#1d1ddd',
              color: '#fff',
              fontWeight: 'bold',
              padding: '10px',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
            onClick={handleDeleteAll}
          >
            Xóa tất cả
          </div>
        )}
        <button onClick={exportExcel} style={{ backgroundColor: 'green', padding: '1rem 1.5rem', color: 'white' }}>
          Export excel
        </button>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
    </div>
  )
}

export default TableComponent
