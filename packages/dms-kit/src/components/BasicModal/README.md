---
group:
  title: 通用
  order: 2
---

# BasicModal 基础模态框

基于 Ant Design Modal 组件封装的基础模态框组件，提供了统一的样式规范和尺寸预设，适用于各种弹窗场景。

## 何时使用

- 需要显示重要信息或操作确认时
- 需要用户输入或选择时
- 需要展示详细内容而不跳转页面时
- 需要保持与设计系统一致的弹窗样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 自定义宽度

<code src="./demo/customWidth.tsx"></code>

### 表单弹窗

<code src="./demo/form.tsx"></code>

### 确认弹窗

<code src="./demo/confirm.tsx"></code>

### 信息展示弹窗

<code src="./demo/info.tsx"></code>

### 复杂内容弹窗

<code src="./demo/complex.tsx"></code>

## API

### BasicModal

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| size | 弹窗尺寸预设 | `'small' \| 'large'` | `'small'` | - |

### 继承属性

BasicModal 组件继承了 Ant Design Modal 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| visible | 对话框是否可见 | `boolean` | `false` | - |
| title | 标题 | `ReactNode` | - | - |
| children | 对话框内容 | `ReactNode` | - | - |
| width | 宽度 | `string \| number` | `480` (small) / `960` (large) | - |
| onOk | 点击确定回调 | `function(e)` | - | - |
| onCancel | 点击遮罩层或右上角叉或取消按钮的回调 | `function(e)` | - | - |
| okText | 确定按钮文字 | `string` | `'确定'` | - |
| cancelText | 取消按钮文字 | `string` | `'取消'` | - |
| confirmLoading | 确定按钮 loading | `boolean` | `false` | - |
| destroyOnClose | 关闭时销毁 Modal 里的子元素 | `boolean` | `false` | - |
| maskClosable | 点击蒙层是否允许关闭 | `boolean` | `true` | - |
| closable | 是否显示右上角的关闭按钮 | `boolean` | `true` | - |
| closeIcon | 自定义关闭图标 | `ReactNode` | `<CloseOutlined />` | - |
| className | 对话框外层容器的类名 | `string` | - | - |
| style | 对话框外层容器的样式 | `CSSProperties` | - | - |

## 设计规范

### 尺寸规范

- **小尺寸 (small)**: `width: 480px` - 适用于简单表单、确认信息等
- **大尺寸 (large)**: `width: 960px` - 适用于复杂表单、详细内容展示等
- **自定义宽度**: 可通过 `width` 属性覆盖预设尺寸

### 样式特性

- 统一的圆角设计 (`border-radius: 8px`)
- 标准化的内边距 (`padding: 24px`)
- 自定义关闭图标 (`CloseOutlined`，16x16px)
- 基于主题的色彩系统
- 响应式设计，支持移动端适配

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicModal = {
  content: {
    backgroundColor: string,
    border: string,
    header: {
      border: string,
      title: {
        color: string
      }
    },
    body: {
      color: string
    },
    footer: {
      backgroundColor: string
    }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `size` 属性提供预设尺寸，可通过 `width` 属性进行覆盖
3. 所有 Ant Design Modal 的属性和事件都可以正常使用
4. 组件会自动应用统一的样式类名 `basic-modal-wrapper`
5. 建议根据内容复杂度选择合适的尺寸预设
6. 弹窗内容应保持简洁，避免信息过载

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Modal 封装
- 支持所有 Modal 组件的属性和事件
- 新增 `size` 属性支持预设尺寸
- 统一的样式规范和主题系统集成
- 自定义关闭图标和样式优化
