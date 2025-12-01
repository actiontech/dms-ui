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

// 定义数据类型
interface ProductRecord {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'in_stock' | 'out_of_stock';
}

// 定义筛选参数类型
interface FilterParams {
  page_index: number;
  page_size: number;
  category?: string; // 对应 category 列的筛选
  status?: string; // 对应 status 列的筛选
}

// 模拟数据
const mockData: ProductRecord[] = [
  {
    id: 1,
    name: 'MacBook Pro',
    category: '电脑',
    price: 12999,
    status: 'in_stock'
  },
  {
    id: 2,
    name: 'iPhone 15',
    category: '手机',
    price: 5999,
    status: 'in_stock'
  },
  {
    id: 3,
    name: 'iPad Air',
    category: '平板',
    price: 4799,
    status: 'out_of_stock'
  },
  {
    id: 4,
    name: 'AirPods Pro',
    category: '耳机',
    price: 1999,
    status: 'in_stock'
  },
  {
    id: 5,
    name: 'Apple Watch',
    category: '手表',
    price: 3199,
    status: 'in_stock'
  }
];

const FilterDemo: React.FC = () => {
  const [dataSource, setDataSource] = useState<ProductRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 使用表格请求参数 hook
  const { pagination, tableFilterInfo, updateTableFilterInfo, tableChange } =
    useTableRequestParams<
      ProductRecord,
      PageInfoWithoutIndexAndSize<FilterParams>
    >();

  /**
   * 定义表格列配置
   *
   * 关键点：通过 filterCustomType 和 filterKey 将列与筛选项关联
   *
   * 1. filterCustomType: 指定筛选组件的类型
   *    - 'select': 下拉选择器，适合枚举值筛选
   *    - 'date-range': 日期范围选择器
   *    - 'input': 输入框，适合文本筛选
   *
   * 2. filterKey: 指定筛选参数对应的字段名
   *    - 必须与后端接口的参数名一致
   *    - 筛选值会自动填充到 tableFilterInfo 中对应的字段
   *
   * 3. filterLabel: 筛选面板中显示的标签名
   *    - 如果不指定，会使用列的 title
   */
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
      width: 120,
      // 配置筛选：分类使用下拉选择器
      filterCustomType: 'select', // 筛选组件类型
      filterKey: 'category', // 对应 FilterParams 中的 category 字段
      filterLabel: '产品分类' // 筛选面板中显示的标签
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      render: (price) => `¥${price}`
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      // 配置筛选：状态使用下拉选择器
      filterCustomType: 'select', // 筛选组件类型
      filterKey: 'status', // 对应 FilterParams 中的 status 字段
      filterLabel: '产品状态', // 筛选面板中显示的标签
      render: (status) => {
        const statusMap = {
          in_stock: { text: '有货', color: 'green' },
          out_of_stock: { text: '缺货', color: 'red' }
        };
        const config = statusMap[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    }
  ];

  /**
   * 使用筛选容器 hook
   *
   * 根据列配置自动生成筛选元数据：
   * - filterButtonMeta: 工具栏筛选按钮需要的数据
   * - filterContainerMeta: 筛选面板需要的数据
   * - updateAllSelectedFilterItem: 展开/收起所有筛选项的方法
   */
  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  // 模拟数据加载
  const loadData = (params: FilterParams) => {
    setLoading(true);

    setTimeout(() => {
      let filteredData = [...mockData];

      // 根据筛选参数过滤数据
      if (params.category) {
        filteredData = filteredData.filter(
          (item) => item.category === params.category
        );
      }

      if (params.status) {
        filteredData = filteredData.filter(
          (item) => item.status === params.status
        );
      }

      // 分页
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
    loadData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, tableFilterInfo]);

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
                    { label: '手表', value: '手表' }
                  ]
                }
              ],
              [
                'status',
                {
                  options: [
                    { label: '有货', value: 'in_stock' },
                    { label: '缺货', value: 'out_of_stock' }
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
        />
      </>
    </ConfigProvider>
  );
};

export default FilterDemo;
