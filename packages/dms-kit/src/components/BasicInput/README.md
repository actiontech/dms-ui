---
group:
  title: 通用
  order: 2
---

# BasicInput 基础输入框

基于 Ant Design Input 封装，提供统一的样式规范和国际化支持，用于文本输入场景。

## 何时使用

- 需要用户输入文本信息
- 需要统一的输入框样式
- 需要国际化占位符支持
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 文本域和密码框

<code src="./demo/textarea.tsx"></code>

## API

BasicInput 继承 Ant Design Input 的所有属性，完整 API 请参考 [Input 文档](https://ant.design/components/input-cn)。

### BasicInput 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 输入框的值 | `string` | - | - |
| defaultValue | 默认值 | `string` | - | - |
| placeholder | 占位符 | `string` | `'请输入'` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| allowClear | 是否显示清除按钮 | `boolean` | `false` | - |
| prefix | 前缀图标 | `ReactNode` | - | - |
| suffix | 后缀图标 | `ReactNode` | - | - |
| addonBefore | 前置标签 | `ReactNode` | - | - |
| addonAfter | 后置标签 | `ReactNode` | - | - |
| onChange | 值变化回调 | `(e) => void` | - | - |
| onPressEnter | 按下回车回调 | `(e) => void` | - | - |

### BasicInput.TextArea 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| rows | 文本域行数 | `number` | `4` | - |
| autoSize | 自适应内容高度 | `boolean \| { minRows, maxRows }` | `false` | - |
| showCount | 是否展示字数 | `boolean` | `false` | - |
| maxLength | 最大长度 | `number` | - | - |

### BasicInput.Password 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| visibilityToggle | 是否显示切换按钮 | `boolean` | `true` | - |
| iconRender | 自定义切换图标 | `(visible) => ReactNode` | - | - |

## 设计规范

### 尺寸规范

- **大尺寸 (lg)**: `height: 40px, padding: 0 12px`
- **默认尺寸**: `height: 32px, padding: 0 11px`  
- **小尺寸 (sm)**: `height: 24px, padding: 0 7px`

### 样式特性

- 统一的圆角设计 (`border-radius: 6px`)
- 基于主题的边框和背景色
- 支持悬停、聚焦、禁用等状态样式
- 自定义清除图标样式
- 国际化占位符文本支持

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.basicInput = {
  default: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  textArea: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  },
  password: {
    default: { border, background, color },
    hover: { border },
    focus: { border, boxShadow },
    disabled: { border, background, color }
  }
}
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 组件会自动应用统一的样式类名 `basic-input-wrapper`
3. 占位符文本会自动使用国际化配置
4. 清除图标使用自定义的 `CloseOutlined` 图标
5. 所有 Ant Design Input 的属性和事件都可以正常使用
6. 组件支持 `ref` 转发，可以获取原生 DOM 元素引用

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Input 封装
- 支持所有 Input 组件的属性和事件
- 新增国际化占位符文本支持
- 自定义清除图标样式
- 统一的样式规范和主题系统集成
- 支持 TextArea 和 Password 子组件
