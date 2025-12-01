---
group:
  title: 自定义组件
  order: 7
---

# CustomForm 自定义表单组件

基于 Ant Design Form 封装，提供标题、标签和特殊样式的表单项组件。

## 何时使用

- 需要大标题或子标题组织表单结构
- 需要无标签的紧凑表单项
- 需要自定义标签内容（标题+提示）

## 代码演示

### 表单标题

<code src="./demo/formTitles.tsx"></code>

### 表单字段

<code src="./demo/formFields.tsx"></code>

## API

CustomForm 基于 Ant Design Form 封装，包含多个表单相关组件。

### FormItemBigTitle

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | ✅ |

### FormItemSubTitle

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | ✅ |

### FormItemLabel

继承 Ant Design Form.Item 的所有属性。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | ✅ |
| label | 标签文本 | `ReactNode` | - | - |
| name | 字段名 | `NamePath` | - | - |
| rules | 验证规则 | `Rule[]` | - | - |

### FormItemNoLabel

继承 Ant Design Form.Item 的所有属性。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | ✅ |
| name | 字段名 | `NamePath` | - | - |
| rules | 验证规则 | `Rule[]` | - | - |

### FormInputBotBorder

继承 Ant Design Input 的所有属性。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| placeholder | 占位符 | `string` | - | - |
| value | 输入框的值 | `string` | - | - |
| onChange | 值变化回调 | `(e: ChangeEvent) => void` | - | - |

### CustomLabelContent

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 标签标题 | `ReactNode` | - | ✅ |
| tips | 提示信息 | `ReactNode` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **标题层级** → FormItemBigTitle（h3）用于主标题，FormItemSubTitle（h4）用于分组标题
3. **标准表单项** → FormItemLabel 提供标准的标签和验证支持
4. **紧凑布局** → FormItemNoLabel 适合无标签的紧凑表单布局
5. **自定义标签** → CustomLabelContent 支持标题+提示的复合标签

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 所有表单组件都支持 Ant Design Form 的验证规则
3. 标题组件（FormItemBigTitle/FormItemSubTitle）仅用于视觉层次，不影响表单逻辑
4. FormItemLabel 和 FormItemNoLabel 本质是 Form.Item 的封装

## 最佳实践

1. **标题层级**：每个表单使用一个 FormItemBigTitle，多个 FormItemSubTitle 分组
2. **标签使用**：常规表单项用 FormItemLabel，紧凑布局用 FormItemNoLabel
3. **自定义标签**：需要额外提示信息时使用 CustomLabelContent
4. **表单验证**：所有组件都支持 rules 属性，配合 Form 实现完整验证
