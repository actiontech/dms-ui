import React, { useEffect, useState } from 'react';
import {
  ActiontechTable,
  TableToolbar,
  TableFilterContainer,
  ConfigProvider,
  useTableRequestParams,
  useTableFilterContainer
} from '@actiontech/dms-kit';
import type {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/dms-kit';
import { Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 定义数据类型
interface ProductRecord {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'out_of_stock' | 'pre_order';
  createTime: string;
}

// 定义筛选参数类型
interface FilterParams {
  page_index: number;
  page_size: number;
  category?: string;
  status?: string;
  fuzzy_keyword?: string;
  order_by?: string;
  is_asc?: boolean;
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
  },
  {
    id: 5,
    name: 'Apple Watch',
    category: '手表',
    price: 3199,
    stock: 30,
    status: 'pre_order',
    createTime: '2024-04-01'
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    category: '配件',
    price: 799,
    stock: 150,
    status: 'in_stock',
    createTime: '2024-02-15'
  }
];

const AdvancedDemo: React.FC = () => {
  const [dataSource, setDataSource] = useState<ProductRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 使用表格请求参数 hook
  const {
    pagination,
    tableFilterInfo,
    updateTableFilterInfo,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword,
    tableChange,
    createSearchParams,
    createSortParams
  } = useTableRequestParams<
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
      width: 150,
      sorter: true
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 120,
      filterCustomType: 'select',
      filterKey: 'category',
      filterLabel: '产品分类'
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      sorter: true,
      render: (price) => `¥${price}`
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 100,
      sorter: (a, b) => a.stock - b.stock
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      filterCustomType: 'select',
      filterKey: 'status',
      filterLabel: '产品状态',
      render: (status) => {
        const statusMap = {
          in_stock: { text: '有货', color: 'green' },
          out_of_stock: { text: '缺货', color: 'red' },
          pre_order: { text: '预售', color: 'blue' }
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

  // 使用筛选容器 hook
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  // 模拟数据加载
  const loadData = (params: FilterParams) => {
    setLoading(true);

    // 模拟异步请求
    setTimeout(() => {
      let filteredData = [...mockData];

      // 应用分类筛选
      if (params.category) {
        filteredData = filteredData.filter(
          (item) => item.category === params.category
        );
      }

      // 应用状态筛选
      if (params.status) {
        filteredData = filteredData.filter(
          (item) => item.status === params.status
        );
      }

      // 应用模糊搜索
      if (params.fuzzy_keyword) {
        filteredData = filteredData.filter((item) =>
          item.name.toLowerCase().includes(params.fuzzy_keyword!.toLowerCase())
        );
      }

      // 应用排序
      if (params.order_by) {
        filteredData.sort((a, b) => {
          const aVal = a[params.order_by as keyof ProductRecord];
          const bVal = b[params.order_by as keyof ProductRecord];
          const compareResult = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return params.is_asc ? compareResult : -compareResult;
        });
      }

      const { page_index, page_size } = params;
      const start = (page_index - 1) * page_size;
      const paginatedData = filteredData.slice(start, start + page_size);

      setDataSource(paginatedData);
      setTotal(filteredData.length);
      setLoading(false);
    }, 500);
  };

  // 请求参数变化时重新加载数据
  useEffect(() => {
    const params: FilterParams = {
      ...tableFilterInfo,
      ...pagination
    };
    createSearchParams(params, searchKeyword);
    createSortParams(params);
    loadData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, tableFilterInfo, searchKeyword]);

  // 处理刷新
  const handleRefresh = () => {
    const params: FilterParams = {
      ...tableFilterInfo,
      ...pagination
    };
    createSearchParams(params, searchKeyword);
    createSortParams(params);
    loadData(params);
  };

  // 处理新增
  const handleAdd = () => {
    console.log('新增产品');
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
          filterButton={{
            filterButtonMeta,
            updateAllSelectedFilterItem,
            disabled: loading
          }}
          searchInput={{
            onChange: setSearchKeyword,
            onSearch: refreshBySearchKeyword,
            value: searchKeyword,
            placeholder: '搜索产品名称'
          }}
          refreshButton={{
            refresh: handleRefresh
          }}
          actions={[
            {
              key: 'add',
              text: '新增产品',
              buttonProps: {
                type: 'primary',
                icon: <PlusOutlined />,
                onClick: handleAdd
              }
            }
          ]}
          loading={loading}
          style={{ width: '100%' }}
        />

        {/* 
          使用独立的 TableFilterContainer 组件
          同样需要设置 width: '100%' 确保筛选容器占满整行
        */}
        <TableFilterContainer<
          ProductRecord,
          PageInfoWithoutIndexAndSize<FilterParams>
        >
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          filterCustomProps={
            new Map([
              [
                'category',
                {
                  options: [
                    { label: '电脑', value: '电脑' },
                    { label: '手机', value: '手机' },
                    { label: '平板', value: '平板' },
                    { label: '耳机', value: '耳机' },
                    { label: '手表', value: '手表' },
                    { label: '配件', value: '配件' }
                  ]
                }
              ],
              [
                'status',
                {
                  options: [
                    { label: '有货', value: 'in_stock' },
                    { label: '缺货', value: 'out_of_stock' },
                    { label: '预售', value: 'pre_order' }
                  ]
                }
              ]
            ])
          }
          disabled={loading}
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
          actions={{
            title: '操作',
            width: 150,
            buttons: [
              {
                key: 'view',
                text: '查看',
                buttonProps: (record) => ({
                  onClick: () => console.log('查看产品:', record)
                })
              },
              {
                key: 'edit',
                text: '编辑',
                buttonProps: (record) => ({
                  onClick: () => console.log('编辑产品:', record)
                })
              }
            ]
          }}
        />
      </>
    </ConfigProvider>
  );
};

export default AdvancedDemo;
