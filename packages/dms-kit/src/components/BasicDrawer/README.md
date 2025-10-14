---
group:
  title: 通用
  order: 3
---

# BasicDrawer 基础抽屉

基于 Ant Design Drawer 组件封装的基础抽屉组件，提供了统一的样式规范和额外的功能特性，适用于侧边内容展示和操作。

## 何时使用

- 需要从右侧滑出内容面板时
- 需要展示详细配置或表单时
- 需要在不跳转页面的情况下展示更多内容时
- 需要保持与设计系统一致的抽屉样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 不同尺寸

<code src="./demo/sizes.tsx"></code>

### 自定义关闭图标

<code src="./demo/customCloseIcon.tsx"></code>

### 无内边距模式

<code src="./demo/noPadding.tsx"></code>

### 表单抽屉

<code src="./demo/form.tsx"></code>

### 内容展示抽屉

<code src="./demo/content.tsx"></code>

## API

### BasicDrawer

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| showClosedIcon | 是否显示自定义关闭图标 | `boolean` | `true` | - |
| noBodyPadding | 是否移除内容区域的内边距 | `boolean` | `false` | - |
| size | 抽屉尺寸预设 | `'default' \| 'large'` | `'default'` | - |

### 继承属性

BasicDrawer 组件继承了 Ant Design Drawer 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| visible | 抽屉是否可见 | `boolean` | `false` | - |
| title | 标题 | `ReactNode` | - | - |
| children | 抽屉内容 | `ReactNode` | - | - |
| width | 宽度 | `string \| number` | `480` (default) / `720` (large) | - |
| placement | 抽屉的方向 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | - |
| onClose | 点击遮罩层或右上角叉或取消按钮的回调 | `function(e)` | - | - |
| maskClosable | 点击蒙层是否允许关闭 | `boolean` | `false` | - |
| closable | 是否显示右上角的关闭按钮 | `boolean` | `false` | - |
| closeIcon | 自定义关闭图标 | `ReactNode` | - | - |
| className | 抽屉外层容器的类名 | `string` | - | - |
| style | 抽屉外层容器的样式 | `CSSProperties` | - | - |
| destroyOnClose | 关闭时销毁 Drawer 里的子元素 | `boolean` | `false` | - |

## 设计规范

### 尺寸规范

- **默认尺寸 (default)**: `width: 480px` - 适用于简单表单、配置面板等
- **大尺寸 (large)**: `width: 720px` - 适用于复杂表单、详细内容展示等
- **自定义宽度**: 可通过 `width` 属性设置任意宽度

### 样式特性

- 统一的圆角设计 (`border-radius: 8px`)
- 标准化的内边距 (`padding: 24px`)
- 自定义关闭图标，位于右上角
- 基于主题的色彩系统
- 响应式设计，支持移动端适配
- 支持无内边距模式，便于自定义布局

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicDrawer = {
  // 主题配置变量
  backgroundColor: string,
  border: string,
  header: {
    backgroundColor: string,
    border: string,
    title: {
      color: string
    }
  },
  body: {
    backgroundColor: string,
    color: string
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `size` 属性提供预设尺寸，可通过 `width` 属性进行覆盖
3. `showClosedIcon` 控制是否显示自定义关闭图标
4. `noBodyPadding` 可以移除内容区域的内边距，便于自定义布局
5. 所有 Ant Design Drawer 的属性和事件都可以正常使用
6. 组件会自动应用统一的样式类名 `basic-drawer-wrapper`
7. 建议根据内容复杂度选择合适的尺寸预设
8. 抽屉内容应保持简洁，避免信息过载

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Drawer 封装
- 支持所有 Drawer 组件的属性和事件
- 新增 `showClosedIcon` 属性支持自定义关闭图标
- 新增 `noBodyPadding` 属性支持无内边距模式
- 新增 `size` 属性支持预设尺寸
- 统一的样式规范和主题系统集成
- 自定义关闭图标和样式优化
