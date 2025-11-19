---
group:
  title: 自定义组件
  order: 7
---

# CustomForm 自定义表单组件

基于 Ant Design Form 封装的表单组件集合，提供标题、标签和特殊样式的表单项组件。

## 何时使用

- 需要大标题或子标题组织表单结构
- 需要无标签的紧凑表单项
- 需要自定义标签内容（标题+提示）
- 需要底部边框样式的输入框

## 代码演示

### 表单标题

<code src="./demo/formTitles.tsx"></code>

### 表单字段

<code src="./demo/formFields.tsx"></code>

## API

### FormItemBigTitle

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | ✅ |

### FormItemSubTitle

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 标题内容 | `ReactNode` | - | ✅ |

### FormItemLabel

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | ✅ |
| label | 标签文本 | `ReactNode` | - | - |
| name | 字段名 | `NamePath` | - | - |
| rules | 验证规则 | `Rule[]` | - | - |

继承 Ant Design Form.Item 的所有其他属性，详见 [Form.Item API](https://ant.design/components/form-cn#formitem)

### FormItemNoLabel

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 表单项内容 | `ReactNode` | - | ✅ |
| name | 字段名 | `NamePath` | - | - |
| rules | 验证规则 | `Rule[]` | - | - |

继承 Ant Design Form.Item 的所有其他属性

### FormInputBotBorder

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| placeholder | 占位符 | `string` | - | - |
| value | 输入框的值 | `string` | - | - |
| onChange | 值变化回调 | `(e: ChangeEvent) => void` | - | - |

继承 Ant Design Input 的所有其他属性

### CustomLabelContent

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 标签标题 | `ReactNode` | - | ✅ |
| tips | 提示信息 | `ReactNode` | - | - |

## 组件特点

1. **标题层级** → FormItemBigTitle（h3）用于主标题，FormItemSubTitle（h4）用于分组标题
2. **标准表单项** → FormItemLabel 提供标准的标签和验证支持
3. **紧凑布局** → FormItemNoLabel 适合无标签的紧凑表单布局
4. **自定义标签** → CustomLabelContent 支持标题+提示的复合标签
5. **特殊样式** → FormInputBotBorder 提供底部边框样式的输入框

## 核心功能详解

### FormItemBigTitle 和 FormItemSubTitle

用于组织表单的视觉层次结构：

```typescript
<FormItemBigTitle>用户信息表单</FormItemBigTitle>

<FormItemSubTitle>基本信息</FormItemSubTitle>
<FormItemLabel label="用户名" name="username">
  <Input />
</FormItemLabel>

<FormItemSubTitle>联系方式</FormItemSubTitle>
<FormItemLabel label="邮箱" name="email">
  <Input />
</FormItemLabel>
```

### CustomLabelContent

提供标题+提示的复合标签，适合复杂表单项：

```typescript
<Form.Item
  label={
    <CustomLabelContent
      title="数据库配置"
      tips="请输入数据库连接信息，包括主机地址、端口等"
    />
  }
  name="databaseConfig"
>
  <Input />
</Form.Item>
```

### FormInputBotBorder

提供底部边框样式的输入框，适合特定设计需求：

```typescript
<FormItemLabel label="备注" name="remark">
  <FormInputBotBorder placeholder="请输入备注" />
</FormItemLabel>
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. 所有表单组件都支持 Ant Design Form 的验证规则
3. 标题组件（FormItemBigTitle/FormItemSubTitle）仅用于视觉层次，不影响表单逻辑
4. FormItemLabel 和 FormItemNoLabel 本质是 Form.Item 的封装
5. FormInputBotBorder 适合特定设计场景，常规场景使用标准 Input 即可

## 最佳实践

1. **标题层级**：每个表单使用一个 FormItemBigTitle，多个 FormItemSubTitle 分组
2. **标签使用**：常规表单项用 FormItemLabel，紧凑布局用 FormItemNoLabel
3. **自定义标签**：需要额外提示信息时使用 CustomLabelContent
4. **特殊样式**：FormInputBotBorder 适合特定设计需求，不建议大量使用
5. **表单验证**：所有组件都支持 rules 属性，配合 Form 实现完整验证
