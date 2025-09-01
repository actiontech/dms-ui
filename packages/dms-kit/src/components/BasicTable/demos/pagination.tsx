import React, { useState } from 'react';
import { BasicTable, ConfigProvider } from '@actiontech/dms-kit';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  }
];

// 模拟大量数据
const generateData = (count: number): DataType[] => {
  const data: DataType[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      key: i.toString(),
      name: `用户${i + 1}`,
      age: 20 + (i % 50),
      address: `地址${i + 1}`
    });
  }
  return data;
};

const allData = generateData(40);

const BasicTablePaginationDemo: React.FC = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: allData.length
  });

  const handleTableChange = (newPagination: number) => {
    setPagination((page) => ({ ...page, current: newPagination }));
    // 这里可以调用 API 获取新数据
    console.log('分页变化:', newPagination);
  };

  // 模拟分页数据
  const getPageData = () => {
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return allData.slice(start, end);
  };

  return (
    <ConfigProvider>
      <BasicTable
        columns={columns}
        dataSource={getPageData()}
        rowKey="key"
        pagination={{
          ...pagination,
          onChange: handleTableChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条数据`
        }}
      />
    </ConfigProvider>
  );
};

export default BasicTablePaginationDemo;
