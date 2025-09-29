---
group:
  title: 通用
  order: 1
---

# EditText 可编辑文本

## 组件介绍

EditText 是一个可编辑的文本组件，支持在显示模式和编辑模式之间切换。它提供了灵活的文本编辑功能，适用于需要内联编辑的场景，如表格单元格编辑、列表项编辑等。

## 何时使用

- 需要在显示和编辑模式之间切换的文本内容
- 表格单元格的内联编辑
- 列表项的可编辑文本
- 需要快速编辑而不跳转页面的场景
- 表单中的动态文本编辑

## 代码演示

### 基础使用

<code src="./demo/basic.tsx"></code>

### 编辑模式

<code src="./demo/editMode.tsx"></code>

## API 文档

### EditTextProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 文本内容 | `string` | - |
| defaultValue | 默认文本内容 | `string` | - |
| onChange | 文本变化回调 | `(value: string) => void` | - |
| onEdit | 编辑状态变化回调 | `(editing: boolean) => void` | - |
| editing | 是否处于编辑状态 | `boolean` | `false` |
| defaultEditing | 默认是否处于编辑状态 | `boolean` | `false` |
| placeholder | 编辑时的占位符 | `string` | - |
| disabled | 是否禁用编辑 | `boolean` | `false` |
| maxLength | 最大字符长度 | `number` | - |
| showCount | 是否显示字符计数 | `boolean` | `false` |
| autoSize | 自动调整大小 | `boolean \| { minRows: number, maxRows: number }` | `false` |
| className | 自定义类名 | `string` | - |
| style | 自定义样式 | `CSSProperties` | - |

## 类型定义

```typescript
interface EditTextProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onEdit?: (editing: boolean) => void;
  editing?: boolean;
  defaultEditing?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showCount?: boolean;
  autoSize?: boolean | { minRows: number; maxRows: number };
  className?: string;
  style?: CSSProperties;
}
```

## 设计规范

### 交互模式

- **显示模式**: 文本以只读形式显示，点击可进入编辑模式
- **编辑模式**: 显示输入框，支持文本编辑，失去焦点或按回车键保存
- **状态切换**: 支持受控和非受控两种模式

### 样式特点

- 继承 Ant Design 的输入框样式
- 支持自定义样式和主题配置
- 响应式设计，适配不同屏幕尺寸
- 统一的交互反馈和动画效果

## 功能特性

### 编辑控制
- 支持点击进入编辑模式
- 支持受控和非受控模式
- 支持禁用编辑功能
- 支持编辑状态回调

### 文本验证
- 支持最大字符长度限制
- 支持字符计数显示
- 支持自定义验证规则
- 支持错误状态显示

### 样式定制
- 支持自定义类名和样式
- 支持自动大小调整
- 支持占位符文本
- 支持主题系统集成

## 使用场景

### 表格单元格编辑
在数据表格中实现单元格的内联编辑功能。

### 列表项编辑
在列表组件中实现项目名称等文本的快速编辑。

### 表单动态编辑
在表单中实现某些字段的动态编辑功能。

### 配置项编辑
在配置界面中实现配置项的快速修改。

## 注意事项

1. **状态管理**: 合理管理编辑状态，避免状态混乱
2. **数据同步**: 确保编辑后的数据及时同步到父组件
3. **用户体验**: 提供清晰的编辑反馈和保存提示
4. **性能考虑**: 避免在大量数据中使用过多的可编辑组件

## 最佳实践

1. **合理使用**: 只在真正需要编辑的场景下使用
2. **状态控制**: 使用受控模式管理编辑状态
3. **验证规则**: 为重要字段添加适当的验证规则
4. **用户反馈**: 提供清晰的编辑成功/失败提示
5. **键盘支持**: 支持回车保存、ESC 取消等快捷键

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基础的文本编辑功能
- 支持显示/编辑模式切换
- 提供完整的 API 接口
