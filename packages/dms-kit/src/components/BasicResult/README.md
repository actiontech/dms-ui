---
group:
  title: 通用
  order: 4
---

# BasicResult 基础结果页

基于 Ant Design Result 组件封装的基础结果页组件，提供了统一的样式规范和自定义图标支持，适用于各种操作结果的展示。

## 何时使用

- 提交表单后需要展示操作结果时
- 操作成功或失败后需要给用户反馈时
- 需要展示空状态或错误状态时
- 需要保持与设计系统一致的结果页样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 不同状态

<code src="./demo/statuses.tsx"></code>

### 自定义图标

<code src="./demo/customIcon.tsx"></code>

### 带操作按钮

<code src="./demo/withActions.tsx"></code>

### 空状态展示

<code src="./demo/empty.tsx"></code>

### 错误状态展示

<code src="./demo/error.tsx"></code>

## API

### BasicResult

BasicResult 组件继承了 Ant Design Result 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| status | 结果的状态，决定图标和颜色 | `'success' \| 'error' \| 'info' \| 'warning' \| '404' \| '403' \| '500'` | `'info'` | - |
| title | 标题 | `ReactNode` | - | - |
| subTitle | 副标题 | `ReactNode` | - | - |
| icon | 自定义图标 | `ReactNode` | - | - |
| extra | 操作区 | `ReactNode` | - | - |
| className | 结果页类名 | `string` | - | - |
| style | 结果页样式 | `CSSProperties` | - | - |

## 设计规范

### 状态规范

- **success**: 成功状态，绿色图标，适用于操作成功场景
- **error**: 错误状态，红色图标，适用于操作失败场景
- **info**: 信息状态，蓝色图标，适用于信息展示场景
- **warning**: 警告状态，橙色图标，适用于警告提示场景
- **404**: 页面不存在，适用于 404 错误页面
- **403**: 无权限访问，适用于权限不足场景
- **500**: 服务器错误，适用于系统错误场景

### 样式特性

- 统一的图标设计，支持所有 Ant Design Result 状态
- 标准化的标题和副标题样式
- 基于主题的色彩系统
- 响应式设计，支持移动端适配
- 支持自定义图标和操作区域

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicResult = {
  // 主题配置变量
  title: {
    color: string,
    fontSize: string,
    fontWeight: string
  },
  subTitle: {
    color: string,
    fontSize: string
  },
  icon: {
    fontSize: string
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `status` 属性决定了图标的样式和颜色
3. 可以通过 `icon` 属性自定义图标
4. `extra` 属性可以添加操作按钮
5. 所有 Ant Design Result 的属性和事件都可以正常使用
6. 组件会自动应用统一的样式类名 `basic-result-wrapper`
7. 建议根据操作结果选择合适的状态
8. 结果页内容应简洁明了，避免信息过载

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Result 封装
- 支持所有 Result 组件的属性和事件
- 统一的样式规范和主题系统集成
- 自定义图标支持
- 响应式设计和移动端适配
