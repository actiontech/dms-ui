---
group:
  title: 业务组件
  order: 3
---

# ActionButton 操作按钮

基于 BasicButton 封装，提供确认框、提示框等常见功能的按钮组件。

## 何时使用

- 需要在按钮点击时显示确认框
- 需要为禁用的按钮显示提示信息
- 需要批量渲染多个操作按钮

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 按钮组

<code src="./demo/group.tsx"></code>

## API

### ActionButton

ActionButton 基于 BasicButton 封装，继承所有 BasicButton 属性。

#### 通用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| text | 按钮文本 | `ReactNode` | - | - |
| actionType | 按钮类型 | `'confirm' \| 'tooltip'` | - | - |

#### actionType='confirm' 时

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| confirm | 确认框配置 | `PopconfirmProps` | - | ✅ |

#### actionType='tooltip' 时

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| tooltip | 提示框配置 | `BasicTooltipProps` | - | ✅ |

### ActionButtonGroup

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| actions | 按钮配置数组 | `Array<ActionButtonProps & { key: Key }>` | - | ✅ |

继承 Ant Design Space 的所有其他属性（如 `size`、`direction` 等）。

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **确认框支持** → actionType='confirm' 时显示确认弹窗
3. **提示框支持** → actionType='tooltip' 时显示提示信息
4. **批量渲染** → ActionButtonGroup 支持批量渲染多个按钮
5. **完全兼容** → 继承 BasicButton 和 Space 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `actionType='confirm'` 时，`confirm` 属性为必填
3. `actionType='tooltip'` 时，`tooltip` 属性为必填
4. ActionButtonGroup 中的每个按钮必须提供唯一的 `key`

## 最佳实践

1. **删除操作**：使用 `actionType='confirm'` 和 `danger` 属性
2. **禁用按钮**：配合 `actionType='tooltip'` 说明禁用原因
3. **按钮组**：使用 ActionButtonGroup 统一管理表格或列表的操作按钮
4. **确认文案**：为重要操作提供清晰的确认文案
