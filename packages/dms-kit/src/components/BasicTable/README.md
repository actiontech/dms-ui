---
group:
  title: 通用
  order: 1
---

# BasicTable 基础表格

基于 Ant Design Table 封装，提供统一的样式风格、错误处理和分页配置。

## 何时使用

- 展示结构化数据
- 需要统一的错误状态展示
- 需要固定分页栏布局
- 需要默认分页配置的表格

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 错误状态

<code src="./demos/error.tsx"></code>

## API

BasicTable 继承 Ant Design Table 的所有属性，完整 API 请参考 [Table 文档](https://ant.design/components/table-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| errorMessage | 错误信息，显示在表格空状态 | `string` | - | - |
| isPaginationFixed | 是否固定分页栏在底部 | `boolean` | `false` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| columns | 表格列配置 | `ColumnsType<T>` | - | ✅ |
| dataSource | 数据源 | `T[]` | - | - |
| rowKey | 行数据的 key | `string \| (record) => string` | `'key'` | ✅ |
| loading | 加载状态 | `boolean \| SpinProps` | `false` | - |
| pagination | 分页配置 | `false \| TablePaginationConfig` | 默认分页 | - |

## 组件特点

1. **自动错误处理** → 通过 `errorMessage` 自动展示 Result 错误状态
2. **默认分页配置** → 自动配置每页 20 条、显示总数、支持切换页大小
3. **自动横向滚动** → 默认设置 `scroll.x` 为 `'max-content'`
4. **固定分页栏** → 通过 `isPaginationFixed` 固定分页栏在底部

## 注意事项

1. 每条数据必须有唯一的 `rowKey` 值
2. `errorMessage` 存在时会覆盖默认空状态
3. 分页默认每页显示 20 条，可通过 `pagination` 自定义
4. 使用 ActiontechTable 的样式系统，会自动应用统一样式

## 最佳实践

1. **rowKey 设置**：优先使用数据的唯一 ID 字段作为 `rowKey`
2. **错误处理**：数据加载失败时使用 `errorMessage` 展示友好提示
3. **分页配置**：大数据量时建议开启 `pagination.showQuickJumper` 快速跳转
4. **固定分页**：长表格建议使用 `isPaginationFixed` 提升用户体验
