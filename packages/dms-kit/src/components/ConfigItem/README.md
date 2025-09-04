---
group:
  title: 业务组件
  order: 3
---

# ConfigItem 配置项

用于展示和编辑系统配置项的组件，提供统一的配置项展示样式和交互模式。

## 何时使用

- 需要展示系统配置信息时
- 需要提供配置项的就地编辑功能时
- 需要统一配置项的展示样式时
- 构建系统设置页面时

## 代码演示


### 可编辑文本输入

<code src="./demo/editInput.tsx"></code>

### 可编辑数字输入

<code src="./demo/editInputNumber.tsx"></code>

### 图片上传

<code src="./demo/imageUploader.tsx"></code>


### 自定义内容

<code src="./demo/custom.tsx"></code>

## API

### ConfigItem

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | 配置项标签 | `string \| ReactNode` | - | - |
| inputNode | 编辑状态下显示的输入组件 | `ReactNode` | - | - |
| descNode | 只读状态下显示的描述内容 | `string \| ReactNode` | - | - |
| fieldVisible | 是否显示编辑字段 | `boolean` | `false` | - |
| showField | 显示编辑字段的回调 | `() => void` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| needEditButton | 是否需要编辑按钮 | `boolean` | `true` | - |

### EditInput

配置项的可编辑文本输入组件，支持验证和键盘快捷键。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| fieldValue | 字段当前值 | `string` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| validator | 输入验证函数 | `(value: string) => boolean` | - | - |
| onSubmit | 提交回调 | `(value: string) => void` | - | - |
| submitLoading | 是否正在提交 | `boolean` | `false` | - |

**键盘快捷键**：
- `Enter` - 提交输入
- `Esc` - 取消编辑

### EditInputNumber

配置项的可编辑数字输入组件，支持验证和键盘快捷键。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| fieldValue | 字段当前值 | `number` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| validator | 输入验证函数 | `(value: number) => boolean` | - | - |
| onSubmit | 提交回调 | `(value: number) => void` | - | - |
| submitLoading | 是否正在提交 | `boolean` | `false` | - |

**键盘快捷键**：
- `Enter` - 提交输入
- `Esc` - 取消编辑

### ImageUploader

配置项的图片上传组件，支持拖拽上传和预览。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| submitLoading | 是否正在提交 | `boolean` | - | - |
| onSubmit | 上传提交回调 | `UploadProps['customRequest']` | - | - |
| url | 图片地址 | `string` | - | - |
| disabled | 是否禁用上传 | `boolean` | `false` | - |

## 设计规范

### 布局结构

- **左侧标签区域**: 占比 45%，显示配置项名称
- **右侧内容区域**: 占比 55%，显示配置值或编辑组件
- **编辑按钮**: 悬停时显示，点击进入编辑模式

### 交互规范

- **悬停效果**: 鼠标悬停时显示编辑按钮
- **编辑模式**: 点击编辑按钮进入编辑状态
- **自动隐藏**: 点击空白区域自动隐藏编辑组件
- **键盘操作**: 支持 Enter 提交，Esc 取消

### 样式特性

- 统一的行高和间距 (`min-height: 48px`)
- 左右布局，标签左对齐，内容右对齐
- 编辑按钮淡入淡出效果
- 支持主题色彩系统

### 状态样式

- **默认状态**: 显示描述内容
- **悬停状态**: 显示编辑按钮
- **编辑状态**: 显示输入组件
- **加载状态**: 显示加载动画
- **错误状态**: 输入验证失败时的错误样式

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `fieldVisible` 控制是否显示编辑字段，需要配合 `showField` 和 `hideField` 使用
3. `EditInput` 和 `EditInputNumber` 组件内置了点击空白区域自动隐藏的逻辑
4. 图片上传组件需要自定义 `customRequest` 来处理实际的上传逻辑
5. 输入组件支持自定义验证器，验证失败时会显示错误样式
6. 建议为复杂的配置项提供合适的描述文本来提升用户体验

## 更新日志

- **1.0.0**: 初始版本
  - 基础配置项展示功能
  - 支持文本、数字、图片三种编辑类型
  - 内置编辑按钮和交互逻辑
  - 支持自定义验证和键盘快捷键
  - 完整的主题样式系统集成