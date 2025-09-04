---
group:
  title: 通用
  order: 1
---

# BasicTable 基础表格组件

## 组件介绍

BasicTable 是一个基于 Ant Design Table 组件封装的基础表格组件，提供了统一的样式风格、错误处理、分页配置等功能。它是 dms-kit 中最常用的数据展示组件之一。

## 何时使用

- 需要展示结构化数据时
- 需要分页、排序、筛选等功能的表格
- 需要统一错误处理和空状态展示
- 需要固定分页栏的表格布局

## 代码演示

### 基础用法

最简单的表格用法，只需要提供列定义和数据源。

<code src="./demos/basic.tsx"></code>

### 带分页的表格

默认启用分页功能，支持页码切换和每页条数调整。

<code src="./demos/pagination.tsx"></code>

### 错误状态表格

当数据加载失败时，显示错误信息和重试提示。

<code src="./demos/error.tsx"></code>

## API 文档

### BasicTableProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| errorMessage | 错误信息，显示在表格空状态区域 | string | - | - |
| isPaginationFixed | 是否固定分页栏在底部 | boolean | false | - |
| className | 自定义 CSS 类名 | string | - | - |

### 继承属性

BasicTable 继承了 Ant Design Table 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| columns | 表格列配置 | ColumnsType | - | - |
| dataSource | 数据源 | T[] | - | - |
| rowKey | 行数据的 key | string \| (record) => string | 'key' | - |
| loading | 加载状态 | boolean \| SpinProps | false | - |
| pagination | 分页配置 | false \| TablePaginationConfig | - | - |
| scroll | 表格滚动配置 | { x?: number \| string \| true, y?: number \| string } | - | - |
| size | 表格大小 | 'small' \| 'middle' \| 'default' | 'default' | - |
| bordered | 是否显示边框 | boolean | false | - |
| rowSelection | 行选择配置 | object | - | - |
| onRow | 设置行属性 | (record, index) => object | - | - |
| onChange | 分页、筛选、排序变化时触发 | (pagination, filters, sorter, extra) => void | - | - |

## 设计规范

### 样式特点

- **统一间距**: 表格单元格内边距为 16px，表头单元格内边距为 0 16px
- **边框样式**: 表头底部边框和行底部边框使用主题色
- **分页样式**: 分页栏固定在底部，支持固定定位模式
- **错误状态**: 错误信息使用 Result 组件展示，提供友好的错误提示

### 主题配置

BasicTable 使用 ActiontechTable 的样式系统，支持以下主题变量：

```less
// 表格样式变量
@table-thead-color: @color-text;
@table-thead-border: 1px solid @color-border;
@table-row-color: @color-text;
@table-row-border: 1px solid @color-border-secondary;
@table-pagination-background-color: @color-bg-layout;
@table-pagination-border: 1px solid @color-border;
@table-pagination-total-color: @color-text-secondary;
```

### 响应式设计

- 表格支持水平滚动，当列数较多时自动启用
- 分页栏在小屏幕设备上自适应布局
- 固定分页栏模式在侧边栏收起时自动调整宽度

## 注意事项

1. **数据源要求**: 每条数据必须有唯一的 `rowKey` 值，用于 React 的 key 属性
2. **分页配置**: 默认每页显示 20 条数据，支持自定义分页配置
3. **错误处理**: 当提供 `errorMessage` 时，会覆盖默认的空状态显示
4. **样式继承**: 组件继承了 ActiontechTable 的所有样式特性
5. **国际化**: 分页文本支持国际化配置，默认使用中文

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基础表格功能
- 集成错误处理和分页配置
- 支持固定分页栏模式
