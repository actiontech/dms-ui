---
group:
  title: 通用
  order: 4
---

# BasicResult 基础结果页

基于 Ant Design Result 封装，提供统一的样式规范，用于展示操作结果反馈。

## 何时使用

- 提交表单后展示操作结果
- 操作成功或失败后给用户反馈
- 展示空状态或错误页面
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 不同状态

<code src="./demo/statuses.tsx"></code>

## API

BasicResult 继承 Ant Design Result 的所有属性，完整 API 请参考 [Result 文档](https://ant.design/components/result-cn)。

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| status | 结果状态 | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` | - |
| title | 标题 | `ReactNode` | - | - |
| subTitle | 副标题 | `ReactNode` | - | - |
| icon | 自定义图标 | `ReactNode` | - | - |
| extra | 操作区（按钮等） | `ReactNode` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用 ActiontechTable 主题系统的样式
2. **多种状态** → 支持 success、error、info、warning、404、403、500 等状态
3. **操作按钮** → 通过 `extra` 属性添加操作按钮
4. **完整功能** → 继承 Ant Design Result 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `status` 属性决定图标样式和颜色，需根据实际场景选择
3. 使用 `extra` 添加操作按钮时，建议提供返回或重试等选项
4. 结果页内容应简洁明了，避免信息过载

## 最佳实践

1. **状态选择**：根据操作结果选择合适的 status（成功用 success，失败用 error）
2. **操作引导**：在 `extra` 中提供明确的下一步操作按钮
3. **信息层级**：使用 `title` 展示主要结果，`subTitle` 补充说明详情
4. **错误页面**：404/403/500 等错误页面建议提供返回首页的按钮
