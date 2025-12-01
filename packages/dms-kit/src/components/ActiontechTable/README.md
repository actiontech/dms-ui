---
group:
  title: 业务组件
  order: 3
---

# ActiontechTable 数据表格

基于 Ant Design Table 封装，提供工具栏、筛选、列设置、操作列等企业级功能。

## 何时使用

- 需要展示大量结构化数据，并进行排序、筛选、搜索
- 需要在表格顶部添加操作按钮、搜索框、刷新按钮等工具栏功能
- 需要支持用户自定义表格列的显示/隐藏、顺序和固定
- 需要在表格中统一管理操作按钮（编辑、删除等）

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 工具栏

<code src="./demo/toolbar.tsx"></code>

### 操作列

<code src="./demo/actions.tsx"></code>

### 筛选功能

<code src="./demo/filter.tsx"></code>

### 高级功能

<code src="./demo/advanced.tsx"></code>

### 列设置

<code src="./demo/setting.tsx"></code>

### 更多操作按钮

<code src="./demo/moreActions.tsx"></code>

## API

ActiontechTable 继承 Ant Design Table 的所有属性，完整 API 请参考 [Table 文档](https://ant.design/components/table-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| toolbar | 工具栏配置 | `TableToolbarProps` \| `false` | - | - |
| filterContainerProps | 筛选容器配置 | `TableFilterContainerProps` | - | - |
| actions | 操作列配置，自动生成操作列 | `ActiontechTableActionsConfig` \| `ActiontechTableActionMeta[]` | - | - |
| setting | 列设置配置，用户的列选择会存储到 localStorage | `ColumnsSettingProps` \| `false` | - | - |
| isPaginationFixed | 分页器是否固定在页面底部 | `boolean` | `true` | - |
| errorMessage | 错误消息，用于请求失败时显示 | `string` | - | - |

### 常用 Table 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| columns | 表格列配置 | `ActiontechTableColumn[]` | - | ✅ |
| dataSource | 数据源 | `T[]` | - | - |
| loading | 加载状态 | `boolean` | `false` | - |
| pagination | 分页配置 | `TablePaginationConfig` \| `false` | - | - |
| onChange | 分页、排序、筛选变化时触发 | `(pagination, filters, sorter) => void` | - | - |
| scroll | 表格滚动配置 | `{ x?: number, y?: number }` | - | - |
| rowKey | 表格行 key 的取值 | `string` \| `(record) => string` | `'key'` | - |

## TableToolbar 工具栏

TableToolbar 可以独立使用，也可以通过 ActiontechTable 的 `toolbar` 属性配置。

### 独立使用

```typescript
import { TableToolbar } from '@actiontech/dms-kit';

<TableToolbar
  refreshButton={{ refresh: handleRefresh }}
  actions={[
    {
      key: 'add',
      text: '新增',
      buttonProps: { type: 'primary', onClick: handleAdd }
    }
  ]}
/>
```

### 通过 ActiontechTable 配置

```typescript
<ActiontechTable
  toolbar={{
    refreshButton: { refresh: handleRefresh },
    actions: [...]
  }}
/>
```

### 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| filterButton | 筛选按钮配置 | `TableFilterButtonProps` \| `false` | - | - |
| searchInput | 搜索框配置 | `TableSearchInputProps` \| `false` | - | - |
| refreshButton | 刷新按钮配置 | `TableRefreshButtonProps` | - | - |
| actions | 工具栏操作按钮（如"新增"） | `ActiontechTableToolbarActionMeta[]` | - | - |
| setting | 列设置按钮配置 | `ColumnsSettingProps` \| `false` | - | - |
| loading | 工具栏加载状态 | `boolean` | `false` | - |

## TableFilterContainer 筛选容器

TableFilterContainer 可以独立使用，也可以通过 ActiontechTable 的 `filterContainerProps` 属性配置。

### 独立使用

```typescript
import { TableFilterContainer } from '@actiontech/dms-kit';

<TableFilterContainer
  filterContainerMeta={filterContainerMeta}
  updateTableFilterInfo={updateTableFilterInfo}
  filterCustomProps={new Map([
    ['status', {
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' }
      ]
    }]
  ])}
/>
```

### 通过 ActiontechTable 配置

```typescript
<ActiontechTable
  filterContainerProps={{
    filterContainerMeta,
    updateTableFilterInfo,
    filterCustomProps: new Map([...])
  }}
/>
```

### 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| filterContainerMeta | 筛选项元数据 | `ActiontechTableFilterContainerMeta` | - | ✅ |
| updateTableFilterInfo | 更新筛选信息的方法 | `(params) => void` | - | ✅ |
| filterCustomProps | 筛选组件自定义属性 | `Map<string, FilterCustomProps>` | - | - |
| disabled | 禁用筛选 | `boolean` | `false` | - |

## Actions 操作列

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 操作列标题 | `ReactNode` | `'操作'` | - |
| width | 操作列宽度 | `number` | - | - |
| fixed | 操作列固定位置 | `'left'` \| `'right'` | - | - |
| buttons | 操作按钮配置 | `ActiontechTableActionMeta[]` | - | ✅ |
| moreButtons | 更多操作按钮（下拉菜单） | `InlineActiontechTableMoreActionsButtonMeta[]` | - | - |

**ActiontechTableActionMeta 配置：**

| 参数 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| key | 按钮唯一标识 | `Key` | ✅ |
| text | 按钮文本 | `ReactNode` | ✅ |
| buttonProps | 按钮属性 | `(record) => ButtonProps` | - |
| confirm | 确认弹窗配置 | `(record) => PopconfirmProps` \| `false` | - |
| permissions | 权限控制 | `(record) => boolean` | - |

## Setting 列设置

列设置功能允许用户自定义表格列的显示/隐藏、顺序和固定位置，用户的选择会自动保存到 localStorage，下次打开页面时会恢复用户的配置。

### 配置说明

| 参数 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| tableName | 表格唯一标识，用于 localStorage 的 key | `string` | ✅ |
| username | 当前用户名，用于区分不同用户的配置 | `string` | ✅ |

### 使用方式

需要同时配置 `toolbar.setting` 和 `table.setting` 两处：

```typescript
<ActiontechTable
  toolbar={{
    setting: {
      tableName: 'product_table',  // 全局唯一，避免不同表格冲突
      username: currentUsername     // 当前登录用户名
    }
  }}
  setting={{
    tableName: 'product_table',    // 与 toolbar.setting 保持一致
    username: currentUsername
  }}
  columns={columns}
  {...props}
/>
```

或使用独立的 TableToolbar 组件：

```typescript
<TableToolbar
  setting={{
    tableName: 'product_table',
    username: currentUsername
  }}
/>

<ActiontechTable
  setting={{
    tableName: 'product_table',
    username: currentUsername
  }}
  {...props}
/>
```

### 存储机制

- **存储位置**：浏览器 localStorage
- **存储 key 格式**：`${tableName}_${username}`
- **存储内容**：列的显示状态、顺序、固定位置等配置
- **自动恢复**：用户下次打开页面时自动应用之前的配置

### 注意事项

1. `tableName` 必须全局唯一，建议使用业务模块名称作为前缀，如 `user_management_table`
2. `username` 用于区分不同用户的配置，确保多用户场景下配置不会混淆
3. 列配置变更（新增/删除列）后，会自动合并用户的历史配置

## ActiontechTableColumn 列配置

ActiontechTableColumn 继承 Ant Design ColumnType，增加了筛选相关属性。完整 API 请参考 [Column 文档](https://ant.design/components/table-cn#column)。

**扩展的筛选属性：**

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| filterCustomType | 筛选组件类型 | `'select'` \| `'date-range'` \| `'input'` \| `'search-input'` | - | - |
| filterKey | 筛选参数的 key | `string` \| `string[]` | - | - |
| filterLabel | 筛选项显示的标签 | `string` | - | - |
| filterOrder | 筛选项排序 | `number` | `0` | - |

## 筛选功能说明

筛选功能通过在列配置中添加 `filterCustomType` 和 `filterKey` 来启用。筛选项与列的关系如下：

### 1. 列配置与筛选项的映射关系

```typescript
const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    // 添加以下属性即可为该列启用筛选
    filterCustomType: 'select',    // 筛选组件类型：下拉选择器
    filterKey: 'status',            // 筛选参数名：对应后端接口的参数字段
    filterLabel: '产品状态'         // 筛选面板中显示的标签
  }
];
```

### 2. 筛选流程

**步骤 1：定义筛选参数类型**

```typescript
interface FilterParams {
  page_index: number;
  page_size: number;
  status?: string;      // 对应 status 列的 filterKey
  category?: string;    // 对应 category 列的 filterKey
}
```

**步骤 2：在列配置中指定筛选属性**

```typescript
const columns = [
  {
    title: '状态',
    dataIndex: 'status',
    filterCustomType: 'select',
    filterKey: 'status',           // 对应 FilterParams.status
    filterLabel: '产品状态'
  },
  {
    title: '分类',
    dataIndex: 'category',
    filterCustomType: 'select',
    filterKey: 'category',         // 对应 FilterParams.category
    filterLabel: '产品分类'
  }
];
```

**步骤 3：使用 hooks 生成筛选元数据**

```typescript
// 管理筛选参数
const { tableFilterInfo, updateTableFilterInfo } = useTableRequestParams<RecordType, FilterParams>();

// 根据列配置生成筛选元数据
const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } = 
  useTableFilterContainer(columns, updateTableFilterInfo);
```

**步骤 4：配置表格的筛选相关属性**

```typescript
<ActiontechTable
  toolbar={{
    filterButton: {
      filterButtonMeta,              // 筛选按钮需要的数据
      updateAllSelectedFilterItem
    }
  }}
  filterContainerProps={{
    filterContainerMeta,             // 筛选面板需要的数据
    updateTableFilterInfo,
    filterCustomProps: new Map([
      ['status', {                   // 对应 filterKey
        options: [                   // 下拉选项
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' }
        ]
      }]
    ])
  }}
/>
```

**步骤 5：获取筛选值并请求数据**

```typescript
useEffect(() => {
  const params = {
    ...pagination,
    ...tableFilterInfo    // tableFilterInfo 会包含 { status: 'enabled', category: '电脑' } 等筛选值
  };
  loadData(params);
}, [pagination, tableFilterInfo]);
```

### 3. filterKey 的特殊用法

**单个字段：**
```typescript
{
  filterKey: 'status'    // tableFilterInfo.status = '选中的值'
}
```

**多个字段（日期范围）：**
```typescript
{
  filterCustomType: 'date-range',
  filterKey: ['start_time', 'end_time']    // tableFilterInfo.start_time = '开始日期'
                                            // tableFilterInfo.end_time = '结束日期'
}
```

### 4. 筛选组件类型

| 类型 | 说明 | 适用场景 |
| --- | --- | --- |
| `select` | 下拉选择器 | 枚举值筛选（状态、类型等） |
| `date-range` | 日期范围选择器 | 日期范围筛选 |
| `input` | 输入框 | 文本筛选 |
| `search-input` | 搜索输入框 | 模糊搜索 |

## 相关 Hooks

### useTableRequestParams

管理表格的请求参数，包括分页、筛选、搜索和排序。

```typescript
const {
  pagination,              // { page_index, page_size }
  tableFilterInfo,         // 筛选参数对象
  updateTableFilterInfo,   // 更新筛选参数
  searchKeyword,           // 当前搜索关键词
  setSearchKeyword,        // 设置搜索关键词
  refreshBySearchKeyword,  // 重置分页并触发搜索
  tableChange,             // 传给 Table 的 onChange
  createSearchParams,      // 将搜索关键词添加到请求参数
  createSortParams,        // 将排序信息添加到请求参数
  sortInfo                 // 当前排序信息
} = useTableRequestParams<RecordType, FilterType>(options);
```

**参数：**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defaultPageSize | 默认每页条数 | `number` | `20` |
| defaultPageIndex | 默认页码 | `number` | `1` |
| defaultFilterInfo | 默认筛选参数 | `F` | `{}` |
| defaultSearchKeyword | 默认搜索关键词 | `string` | `''` |

### useTableFilterContainer

根据列配置生成筛选容器所需的元数据。

```typescript
const {
  filterButtonMeta,            // 筛选按钮的元数据
  filterContainerMeta,         // 筛选容器的元数据
  updateAllSelectedFilterItem, // 展开/收起所有筛选项
  updateFilterButtonMeta       // 手动更新筛选按钮元数据
} = useTableFilterContainer(
  columns,                     // 表格列配置
  updateTableFilterInfo,       // 来自 useTableRequestParams
  extraFilterMeta?             // 额外的筛选项（不在列中的）
);
```

### useTableRequestError

统一处理表格请求错误。

```typescript
const {
  errorMessage,              // 错误消息（传给 Table 的 errorMessage 属性）
  handleTableRequestError    // 捕获错误并设置错误消息
} = useTableRequestError();
```

## 分页器固定

通过 `isPaginationFixed` 属性（默认 `true`），分页器会固定在页面底部，即使表格数据较少也能快速翻页，提升操作效率。

```typescript
<ActiontechTable
  isPaginationFixed={true}  // 默认值，分页器固定在页面底部
  {...props}
/>
```

如需取消固定效果，设置为 `false`：

```typescript
<ActiontechTable
  isPaginationFixed={false}  // 分页器跟随表格，不固定
  {...props}
/>
```

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **工具栏集成** → 支持搜索、筛选、刷新、自定义按钮等功能
3. **高级筛选** → 支持多种筛选组件，自动管理筛选状态
4. **列设置** → 支持用户自定义列的显示/隐藏、顺序和固定，配置自动存储到 localStorage
5. **操作列** → 统一管理操作按钮，支持权限控制和确认弹窗
6. **分页器固定** → 分页器固定在页面底部，提升操作效率
7. **错误处理** → 优雅展示请求错误信息
8. **完全兼容** → 继承 Ant Design Table 所有功能


## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 使用筛选功能时，需要配合 `useTableRequestParams` 和 `useTableFilterContainer` hooks
3. 列配置中的 `filterCustomType` 和 `filterKey` 必须同时配置才能启用该列的筛选
4. 使用列设置功能时，`tableName` 需要全局唯一，它会作为 localStorage 的 key，避免不同表格配置冲突
5. `TableToolbar` 和 `TableFilterContainer` 可以独立使用，也可以通过 ActiontechTable 的 props 配置
6. 独立使用时，需要将这些组件与 ActiontechTable 放在同一个容器中，推荐使用 Space 组件布局

## 最佳实践

1. **错误处理**：使用 `useTableRequestError` 处理请求错误，通过 `errorMessage` 属性展示
2. **筛选配置**：在列定义中配置 `filterCustomType` 和 `filterKey`，自动生成筛选项
3. **操作权限**：使用 `actions.buttons[].permissions` 控制按钮的显示权限
4. **确认操作**：对于删除等危险操作，配置 `confirm` 属性添加二次确认
5. **性能优化**：使用 `rowKey` 指定唯一标识，避免不必要的渲染
