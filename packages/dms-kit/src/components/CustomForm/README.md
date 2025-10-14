---
group:
  title: 自定义组件
  order: 7
---

# CustomForm 自定义表单组件

基于 Ant Design Form 组件封装的自定义表单组件集合，提供了多种表单布局样式、标题组件和特殊的表单字段组件，满足不同场景的表单设计需求。

## 何时使用

- 需要大标题样式的表单标题时
- 需要子标题样式的表单分组时
- 需要无标签的表单项时
- 需要自定义标签内容的表单项时
- 需要底部边框样式的输入框时
- 需要保持与设计系统一致的表单样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 表单标题组件

<code src="./demo/formTitles.tsx"></code>

### 表单字段组件

<code src="./demo/formFields.tsx"></code>

### 复杂表单布局

<code src="./demo/complexLayout.tsx"></code>

### 表单验证

<code src="./demo/formValidation.tsx"></code>

### 响应式表单

<code src="./demo/responsiveForm.tsx"></code>


## API

### FormItemBigTitle

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | - |

### FormItemSubTitle

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | - |

### FormItemLabel

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | - |

### FormItemNoLabel

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | - |

### FormInputBotBorder

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| placeholder | 占位符文本 | `string` | - | - |

### CustomLabelContent

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 标签标题 | `ReactNode` | - | - |
| tips | 提示信息 | `ReactNode` | - | - |

### 继承属性

所有表单组件都继承了 Ant Design Form.Item 组件的相关属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 字段名 | `string \| number \| (string \| number)[]` | - | - |
| label | 标签文本 | `ReactNode` | - | - |
| rules | 验证规则 | `Rule[]` | - | - |
| required | 是否必填 | `boolean` | `false` | - |
| help | 帮助信息 | `ReactNode` | - | - |
| validateStatus | 验证状态 | `'success' \| 'warning' \| 'error' \| 'validating'` | - | - |
| hasFeedback | 是否有反馈图标 | `boolean` | `false` | - |

## 设计规范

### 标题层级

- **FormItemBigTitle**: 使用 `h3` 标签，适合表单的主要标题
- **FormItemSubTitle**: 使用 `h4` 标签，适合表单的分组标题

### 样式特性

- 统一的字体大小和颜色规范
- 一致的间距和边距设计
- 响应式的布局适配
- 支持主题系统的样式配置

### 布局规范

- 标准表单项使用 `FormItemLabel`
- 紧凑布局使用 `FormItemNoLabel`
- 特殊设计使用 `FormInputBotBorder`
- 复杂标签使用 `CustomLabelContent`


## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 所有表单组件都支持 Ant Design Form 的验证规则
3. 标题组件主要用于视觉层次，不影响表单逻辑
4. 特殊样式组件（如 `FormInputBotBorder`）适合特定设计需求
5. 可以组合使用多个组件创建复杂的表单布局

## 更新日志

- **1.0.0**: 初始版本，提供基础的表单组件集合
- 支持多种表单标题样式
- 支持多种表单字段布局
- 统一的样式规范和主题系统集成
- 继承 Ant Design Form 的所有功能
- 支持响应式布局和自定义样式
