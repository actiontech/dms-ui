---
group:
  title: 通用
  order: 2
---

# BasicModal 基础模态框

基于 Ant Design Modal 封装，提供统一的样式规范和尺寸预设，适用于各种弹窗场景。

## 何时使用

- 需要显示重要信息或操作确认
- 需要用户输入或选择
- 需要展示详细内容而不跳转页面
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 表单弹窗

<code src="./demo/form.tsx"></code>

## API

BasicModal 继承 Ant Design Modal 的所有属性，完整 API 请参考 [Modal 文档](https://ant.design/components/modal-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| size | 弹窗尺寸预设 | `'small' \| 'large'` | `'small'` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| open | 是否显示（v5 推荐） | `boolean` | `false` | - |
| title | 标题 | `ReactNode` | - | - |
| width | 宽度（会覆盖 size） | `string \| number` | `480` (small) / `960` (large) | - |
| onOk | 确定回调 | `(e) => void` | - | - |
| onCancel | 取消回调 | `(e) => void` | - | - |
| okText | 确定按钮文字 | `string` | `'确定'` | - |
| cancelText | 取消按钮文字 | `string` | `'取消'` | - |
| confirmLoading | 确定按钮 loading | `boolean` | `false` | - |
| destroyOnClose | 关闭时销毁子元素 | `boolean` | `false` | - |
| maskClosable | 点击蒙层是否关闭 | `boolean` | `true` | - |
| footer | 自定义底部按钮 | `ReactNode` | 确定取消按钮 | - |

## 组件特点

1. **统一样式规范** → 自动应用 ActiontechTable 主题系统的样式
2. **尺寸预设** → 提供 small（480px）和 large（960px）两种预设尺寸
3. **自定义关闭图标** → 使用统一的关闭图标样式
4. **完整功能** → 继承 Ant Design Modal 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `size` 属性提供预设尺寸，可通过 `width` 属性覆盖
3. 使用 `destroyOnClose` 确保表单数据在关闭后被清空
4. 弹窗内容应保持简洁，避免信息过载

## 最佳实践

1. **尺寸选择**：简单表单用 small，复杂表单或详细内容用 large
2. **表单弹窗**：设置 `destroyOnClose={true}` 避免数据残留
3. **确认操作**：使用 `confirmLoading` 展示提交状态，防止重复提交
4. **关闭处理**：在 `onCancel` 中重置表单状态，提供良好的用户体验
