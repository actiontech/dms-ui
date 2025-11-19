---
group:
  title: 自定义组件
  order: 7
---

# CustomInput 自定义输入框

基于 Ant Design Input 和 BasicInput 封装，提供自定义回车键处理和统一样式的输入框组件。

## 何时使用

- 需要自定义回车键处理逻辑
- 需要带前缀图标或文本的输入框
- 需要统一的输入框样式
- 需要快捷输入提交场景（搜索、命令执行等）

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义回车处理

<code src="./demo/customEnter.tsx"></code>

## API

### CustomInput

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| onCustomPressEnter | 回车键处理函数 | `(value: string) => void` | - | ✅ |
| prefix | 输入框前缀 | `ReactNode` | - | - |
| placeholder | 占位符 | `string` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'small' \| 'middle' \| 'large'` | `'small'` | - |
| value | 输入框的值 | `string` | - | - |
| defaultValue | 默认值 | `string` | - | - |
| onChange | 值变化回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - | - |
| onBlur | 失去焦点回调 | `(e: FocusEvent<HTMLInputElement>) => void` | - | - |
| onFocus | 获得焦点回调 | `(e: FocusEvent<HTMLInputElement>) => void` | - | - |

继承 Ant Design Input 的所有其他属性，详见 [Input API](https://ant.design/components/input-cn#api)

## 组件特点

1. **回车键处理** → 提供 `onCustomPressEnter` 实现快捷提交，接收输入框当前值作为参数
2. **前缀支持** → 支持图标和文本前缀，提升用户体验和输入识别度
3. **样式统一** → 基于 BasicInput 提供统一的设计系统样式
4. **完全兼容** → 继承 Ant Design Input 所有功能和事件
5. **多种尺寸** → 支持 small、middle、large 三种尺寸

## 核心功能详解

### onCustomPressEnter（自定义回车处理）

当用户按下回车键时触发，接收当前输入框的值作为参数：

```typescript
const handlePressEnter = (value: string) => {
  // 执行搜索、提交命令等操作
  console.log('用户输入:', value);
};

<CustomInput
  placeholder="输入后按回车"
  onCustomPressEnter={handlePressEnter}
/>
```

**常见应用场景：**
- 搜索框：按回车触发搜索
- 命令输入：按回车执行命令
- SQL 编辑器：按回车执行 SQL
- 快速提交：按回车提交表单

### prefix（前缀）

支持图标和文本两种前缀形式：

```typescript
// 图标前缀
<CustomInput
  prefix={<SearchOutlined />}
  placeholder="搜索"
  onCustomPressEnter={handleSearch}
/>

// 文本前缀
<CustomInput
  prefix="用户名:"
  placeholder="请输入用户名"
  onCustomPressEnter={handleSubmit}
/>
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. `onCustomPressEnter` 是必填属性，必须提供回车处理逻辑
3. 默认尺寸为 `small`，可通过 `size` 属性修改
4. 继承所有 Ant Design Input 属性和事件
5. 回车事件会传递当前输入框的值，而非原生事件对象

## 最佳实践

1. **搜索场景**：使用搜索图标前缀，回车触发搜索，提供即时反馈
2. **命令输入**：使用命令符号前缀（如 `>`），回车执行命令
3. **快速提交**：在回车处理函数中添加验证逻辑，避免提交无效数据
4. **用户反馈**：回车处理后使用 message 提示用户操作结果
5. **表单集成**：与 Form 组件配合使用时，回车可触发表单提交
