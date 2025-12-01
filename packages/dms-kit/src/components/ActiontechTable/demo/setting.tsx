import React, { useEffect, useState } from 'react';
import {
  ActiontechTable,
  TableToolbar,
  ConfigProvider,
  useTableRequestParams
} from '@actiontech/dms-kit';
import type {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit';
import { Tag } from 'antd';

// 定义数据类型
interface ProductRecord {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'out_of_stock';
  createTime: string;
}

// 定义筛选参数类型
interface FilterParams {
  page_index: number;
  page_size: number;
}

// 模拟数据
const mockData: ProductRecord[] = [
  {
    id: 1,
    name: 'MacBook Pro',
    category: '电脑',
    price: 12999,
    stock: 50,
    status: 'in_stock',
    createTime: '2024-01-15'
  },
  {
    id: 2,
    name: 'iPhone 15',
    category: '手机',
    price: 5999,
    stock: 100,
    status: 'in_stock',
    createTime: '2024-02-20'
  },
  {
    id: 3,
    name: 'iPad Air',
    category: '平板',
    price: 4799,
    stock: 0,
    status: 'out_of_stock',
    createTime: '2024-03-10'
  },
  {
    id: 4,
    name: 'AirPods Pro',
    category: '耳机',
    price: 1999,
    stock: 200,
    status: 'in_stock',
    createTime: '2024-01-25'
  }
];

const SettingDemo: React.FC = () => {
  const [dataSource, setDataSource] = useState<ProductRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 使用表格请求参数 hook
  const { pagination, tableChange } = useTableRequestParams<
    ProductRecord,
    PageInfoWithoutIndexAndSize<FilterParams>
  >();

  // 定义表格列
  const columns: ActiontechTableColumn<
    ProductRecord,
    PageInfoWithoutIndexAndSize<FilterParams>
  > = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      width: 150
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      render: (price) => `¥${price}`
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => {
        const statusMap = {
          in_stock: { text: '有货', color: 'green' },
          out_of_stock: { text: '缺货', color: 'red' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150
    }
  ];

  // 模拟数据加载
  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const { page_index, page_size } = pagination;
      const start = (page_index - 1) * page_size;
      const paginatedData = mockData.slice(start, start + page_size);

      setDataSource(paginatedData);
      setTotal(mockData.length);
      setLoading(false);
    }, 500);
  };

  // 请求参数变化时重新加载数据
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  // 处理刷新
  const handleRefresh = () => {
    loadData();
  };

  return (
    <ConfigProvider>
      <>
        {/* 
          使用独立的 TableToolbar 组件
          注意：在 demo 环境中，组件外层有容器包裹，需要手动设置 width: '100%' 
          在实际项目中使用时，如果也遇到宽度不足的问题，请添加相同的 style
        */}
        <TableToolbar
          refreshButton={{
            refresh: handleRefresh
          }}
          // 配置列设置按钮
          setting={{
            tableName: 'product_setting_demo_table', // 全局唯一标识
            username: 'demo_user' // 当前用户名
          }}
          loading={loading}
          style={{ width: '100%' }}
        />

        <ActiontechTable<
          ProductRecord,
          PageInfoWithoutIndexAndSize<FilterParams>
        >
          rowKey="id"
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          onChange={tableChange}
          // 同时配置表格的 setting 属性
          setting={{
            tableName: 'product_setting_demo_table',
            username: 'demo_user'
          }}
        />
      </>
    </ConfigProvider>
  );
};

export default SettingDemo;
