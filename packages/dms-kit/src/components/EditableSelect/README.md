---
group:
  title: 业务组件
  order: 3
---

# EditableSelect 可编辑选择器

支持选择、添加、编辑和删除选项的可编辑选择器组件。

## 何时使用

- 需要动态管理选项列表
- 构建标签管理、类别管理等功能
- 表单中需要可扩展的选择字段

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 异步操作

<code src="./demo/async.tsx"></code>

### 表单集成

<code src="./demo/formIntegration.tsx"></code>

## API

### EditableSelect

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 当前选中的值 | `EditableSelectValue` | - | - |
| onChange | 选择变化回调 | `(value: EditableSelectValue) => void` | - | - |
| options | 选项数据源 | `EditableSelectOption[]` | `[]` | - |
| onAdd | 添加新选项回调 | `(value: string) => void` | - | - |
| onUpdate | 更新选项回调 | `(newData: EditableSelectOption) => void` | - | - |
| onDelete | 删除选项回调 | `(item: EditableSelectOption) => Promise<boolean> \| void` | - | - |
| addable | 是否允许添加新选项 | `boolean` | `true` | - |
| updatable | 是否允许编辑选项 | `boolean` | `true` | - |
| deletable | 是否允许删除选项 | `boolean` | `true` | - |
| addButtonText | 添加按钮的文本 | `string` | - | - |
| placeholder | 选择框占位符 | `string` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| deletionConfirmTitle | 删除确认弹窗的标题 | `ReactNode \| (option: EditableSelectOption) => ReactNode` | - | - |
| errorMessage | 错误信息（显示红色边框） | `string` | - | - |

### 数据结构

```typescript
type EditableSelectValue = string | number;

interface EditableSelectOption {
  value: EditableSelectValue;
  label: string;
}
```

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **完整 CRUD 操作** → 支持选择、添加、编辑和删除选项
3. **权限控制** → 通过 addable、updatable、deletable 灵活控制操作权限
4. **状态管理** → 支持加载、禁用、错误等多种状态
5. **键盘交互** → 编辑时支持 Enter 保存，Esc 取消

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `onDelete` 回调支持返回 `Promise<boolean>` 来控制删除是否成功
3. 编辑和删除操作会自动阻止事件冒泡，避免触发选择
4. `errorMessage` 属性设置后会显示错误样式，需要手动清除
5. 建议为选项设置有意义的 `value` 值，确保唯一性

## 最佳实践

1. **异步操作**：为异步操作提供加载状态和错误处理
2. **删除验证**：`onDelete` 返回 `Promise<boolean>` 控制删除是否成功
3. **表单集成**：结合 Form.Item 使用，添加验证规则
4. **错误处理**：使用 `errorMessage` 显示验证错误，操作成功后清除
