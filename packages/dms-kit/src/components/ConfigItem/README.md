---
group:
  title: 业务组件
  order: 3
---

# ConfigItem 配置项

用于展示和编辑系统配置项的组件，提供统一的配置项展示样式和交互模式。

## 何时使用

- 需要展示系统配置信息
- 需要提供配置项的就地编辑功能
- 构建系统设置页面

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

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| label | 配置项标签 | `string \| ReactNode` | - | - |
| inputNode | 编辑状态下显示的输入组件 | `ReactNode` | - | - |
| descNode | 只读状态下显示的描述内容 | `string \| ReactNode` | - | - |
| fieldVisible | 是否显示编辑字段 | `boolean` | `false` | - |
| showField | 显示编辑字段的回调 | `() => void` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| needEditButton | 是否需要编辑按钮 | `boolean` | `true` | - |

### EditInput

配置项的可编辑文本输入组件，支持验证和键盘快捷键（Enter 提交，Esc 取消）。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| fieldValue | 字段当前值 | `string` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| validator | 输入验证函数 | `(value: string) => boolean` | - | - |
| onSubmit | 提交回调 | `(value: string) => void` | - | - |
| submitLoading | 是否正在提交 | `boolean` | `false` | - |

### EditInputNumber

配置项的可编辑数字输入组件，支持验证和键盘快捷键（Enter 提交，Esc 取消）。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| fieldValue | 字段当前值 | `number` | - | - |
| hideField | 隐藏编辑字段的回调 | `() => void` | - | - |
| validator | 输入验证函数 | `(value: number) => boolean` | - | - |
| onSubmit | 提交回调 | `(value: number) => void` | - | - |
| submitLoading | 是否正在提交 | `boolean` | `false` | - |

### ImageUploader

配置项的图片上传组件，支持拖拽上传和预览。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| submitLoading | 是否正在提交 | `boolean` | - | - |
| onSubmit | 上传提交回调 | `UploadProps['customRequest']` | - | - |
| url | 图片地址 | `string` | - | - |
| disabled | 是否禁用上传 | `boolean` | `false` | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **就地编辑** → 点击编辑按钮进入编辑模式，支持键盘快捷键
3. **多种输入类型** → 支持文本、数字、图片三种编辑类型
4. **自动隐藏** → 点击空白区域自动隐藏编辑组件
5. **验证支持** → 支持自定义验证器，验证失败显示错误样式

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `fieldVisible` 控制是否显示编辑字段，需要配合 `showField` 和 `hideField` 使用
3. `EditInput` 和 `EditInputNumber` 内置点击空白区域自动隐藏的逻辑
4. 图片上传组件需要自定义 `customRequest` 来处理实际的上传逻辑
5. 输入组件支持自定义验证器，验证失败时会显示错误样式

## 最佳实践

1. **描述文本**：为配置项提供清晰的描述文本，提升用户体验
2. **验证器**：使用 `validator` 函数对输入进行验证
3. **加载状态**：异步操作时使用 `submitLoading` 提供反馈
4. **键盘快捷键**：利用 Enter 提交和 Esc 取消提升效率