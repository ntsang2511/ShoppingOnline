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
    onChange: (selectedRowKeys, selectedRows) => {
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
  // const exportExcel = () => {
  //   const excel = new Excel()
  //   excel
  //     .addSheet('test')
  //     .addColumns(columns)
  //     .addDataSource(data, {
  //       str2Percent: true
  //     })
  //     .saveAs('Excel.xlsx')
  // }
  const exportExcel = () => {
    // Tạo phiên bản Excel
    const excel = new Excel()

    // Chuẩn bị cột: Lọc bỏ các cột không cần xuất (như Action)
    const exportableColumns = columns
      .filter((col) => col.dataIndex && col.dataIndex !== 'action' && col.dataIndex !== 'image')
      .map((col) => ({
        title: col.title,
        dataIndex: col.dataIndex
      }))

    // Chuẩn bị dữ liệu: Chuyển đổi nếu có render
    const exportableData = data.map((row) => {
      const newRow = {}
      exportableColumns.forEach((col) => {
        // Nếu cột có hàm render (ví dụ cột image), lấy giá trị từ dataIndex
        if (col.dataIndex === 'image') {
          newRow[col.dataIndex] = row[col.dataIndex] // Lấy link ảnh gốc
        } else {
          newRow[col.dataIndex] = row[col.dataIndex]
        }
      })
      return newRow
    })

    // Tạo file Excel
    excel
      .addSheet('Table Data') // Tên sheet
      .addColumns(exportableColumns) // Các cột
      .addDataSource(exportableData, {
        str2Percent: true
      })
      .saveAs('TableData.xlsx') // Tên file xuất
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
        <button onClick={exportExcel}>Export excel</button>
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
