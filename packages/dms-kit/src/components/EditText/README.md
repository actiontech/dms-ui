---
group:
  title: 通用
  order: 1
---

# EditText 可编辑文本

可内联编辑的文本组件，支持点击编辑和自动保存功能。

## 何时使用

- 需要内联编辑文本内容
- 表格单元格的快速编辑
- 列表项的可编辑文本
- 不需要跳转页面的文本编辑

## 代码演示

### 基础使用

<code src="./demo/basic.tsx"></code>

## API

### EditText

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 文本内容 | `string` | - | ✅ |
| editable | 可编辑配置 | `EditConfig` | - | - |
| editButtonProps | 空值时的编辑按钮属性 | `ButtonProps` | - | - |

### EditConfig

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| editing | 是否处于编辑状态（受控） | `boolean` | - | - |
| onChange | 文本变化回调 | `(value: string) => void` | - | ✅ |
| onStart | 开始编辑回调 | `() => void` | - | - |
| onEnd | 结束编辑回调 | `(value: string) => void` | - | - |
| onCancel | 取消编辑回调 | `() => void` | - | - |
| maxLength | 最大字符长度 | `number` | - | - |
| autoSize | 自动调整大小 | `boolean \| { minRows: number, maxRows: number }` | `false` | - |

继承 Ant Design Typography.Text 的所有属性，详见 [Typography.Text API](https://ant.design/components/typography-cn#typographytext)

## 组件特点

1. **点击编辑** → 点击文本即可进入编辑模式，无需额外按钮
2. **自动保存** → 失去焦点或按回车键自动保存，按 ESC 取消
3. **空值处理** → 当文本为空时显示编辑按钮，支持自定义按钮文字
4. **受控模式** → 支持外部控制编辑状态，适合复杂场景
5. **灵活配置** → 支持字符长度限制、自动大小调整等

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. `editable.onChange` 是必填属性
3. 当 `value` 为空时，会显示编辑按钮（可通过 `editButtonProps` 自定义）
4. `maxLength`、`autoSize` 等编辑相关属性需放在 `editable` 对象内
5. 基于 Ant Design Typography.Paragraph，继承其所有属性

## 最佳实践

1. **简单场景**：使用非受控模式（只提供 `onChange`），组件自动管理状态
2. **复杂场景**：使用受控模式（提供 `editing`），精确控制编辑时机
3. **用户反馈**：在 `onEnd` 回调中添加保存成功提示
4. **空值提示**：使用 `editButtonProps.children` 设置有意义的提示文字
5. **性能考虑**：避免在大型表格中同时使用过多可编辑组件
