---
group:
  title: 自定义组件
  order: 7
---

# CustomInput 自定义输入框

基于 Ant Design Input 和 BasicInput 封装，提供自定义回车键处理和统一样式。

## 何时使用

- 需要自定义回车键处理逻辑
- 需要带前缀图标或文本的输入框
- 需要快捷输入提交场景（搜索、命令执行等）

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义回车处理

<code src="./demo/customEnter.tsx"></code>

## API

CustomInput 基于 Ant Design Input 和 BasicInput 封装，继承所有 Input 属性。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| onCustomPressEnter | 回车键处理函数（接收输入框当前值） | `(value: string) => void` | - | ✅ |

### 常用 Input 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefix | 输入框前缀 | `ReactNode` | - | - |
| placeholder | 占位符 | `string` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'small' \| 'middle' \| 'large'` | `'small'` | - |
| value | 输入框的值 | `string` | - | - |
| defaultValue | 默认值 | `string` | - | - |
| onChange | 值变化回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **回车键处理** → 提供 `onCustomPressEnter` 实现快捷提交，接收输入框当前值作为参数
3. **前缀支持** → 支持图标和文本前缀，提升用户体验和输入识别度
4. **完全兼容** → 继承 Ant Design Input 所有功能和事件

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `onCustomPressEnter` 是必填属性，必须提供回车处理逻辑
3. 默认尺寸为 `small`，可通过 `size` 属性修改
4. 回车事件会传递当前输入框的值，而非原生事件对象

## 最佳实践

1. **搜索场景**：使用搜索图标前缀，回车触发搜索
2. **命令输入**：使用命令符号前缀（如 `>`），回车执行命令
3. **快速提交**：在回车处理函数中添加验证逻辑，避免提交无效数据
4. **用户反馈**：回车处理后使用 message 提示用户操作结果
