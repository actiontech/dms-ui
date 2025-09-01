---
group:
  title: 通用
  order: 1
---

# BasicEmpty 基础空状态组件

基于 Ant Design Empty 组件封装的基础空状态组件，提供了统一的样式规范和额外的功能特性，支持加载状态、错误状态和自定义内容。

## 何时使用

- 需要展示空数据状态时
- 需要展示加载状态时
- 需要展示错误状态时
- 需要保持与设计系统一致的空状态组件时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 加载状态

<code src="./demo/loading.tsx"></code>

### 错误状态

<code src="./demo/error.tsx"></code>


### 带刷新按钮

<code src="./demo/withRefresh.tsx"></code>



## API

### BasicEmpty

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| dataLength | 数据长度，为 0 时显示空状态 | `number` | - | - |
| errorInfo | 错误信息，可以是字符串或 ReactNode | `string \| ReactNode` | - | - |
| errorTitle | 错误标题 | `string \| ReactNode` | - | - |
| emptyCont | 自定义空状态内容 | `string \| ReactNode` | `'暂无数据'` | - |
| onRefresh | 刷新回调函数 | `() => void` | - | - |
| children | 子元素，当有数据时显示 | `ReactNode` | - | - |

### 继承属性

BasicEmpty 组件继承了 Ant Design Empty 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| image | 自定义图片 | `ReactNode` | - | - |
| description | 自定义描述内容 | `ReactNode` | - | - |
| className | 容器类名 | `string` | - | - |
| style | 容器样式 | `CSSProperties` | - | - |

## 设计规范

### 状态类型

- **加载状态 (loading)**: 显示旋转的加载图标
- **错误状态 (errorInfo)**: 显示错误图标和错误信息
- **空状态 (dataLength === 0)**: 显示空状态图标和提示文字
- **有数据状态**: 显示 children 内容

### 样式特性

- 统一的图标尺寸 (`80x80px`)
- 基于主题的色彩系统
- 支持自定义图标和内容
- 响应式的布局设计
- 集成的刷新按钮样式

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicEmpty = {
  default: {
    color,
    fontSize
  },
  loading: {
    color
  },
  error: {
    color,
    iconColor
  },
  empty: {
    color,
    iconColor
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-empty-wrapper`
3. 当 `loading` 为 true 时，会覆盖其他状态的显示
4. 当 `errorInfo` 存在时，会显示错误状态
5. 当 `dataLength` 为 0 时，会显示空状态
6. 当有 `children` 且数据存在时，会显示 children 内容
7. 组件集成了国际化支持，默认文字会根据当前语言显示

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Empty 封装
- 支持加载状态、错误状态、空状态等多种状态
- 新增 `dataLength` 属性自动判断显示状态
- 新增 `onRefresh` 属性支持刷新功能
- 集成 BasicButton 组件支持操作按钮
- 统一的样式规范和主题系统集成
