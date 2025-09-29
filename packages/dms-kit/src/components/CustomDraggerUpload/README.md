---
group:
  title: 自定义组件
  order: 10
---

# CustomDraggerUpload 自定义拖拽上传

基于 Ant Design Upload.Dragger 组件封装的自定义拖拽上传组件，提供了统一的样式规范和增强的视觉效果。

## 何时使用

- 需要拖拽上传文件时
- 需要自定义上传区域的图标和标题时
- 需要保持与设计系统一致的上传组件样式时
- 需要隐藏上传区域（当有文件列表时）时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义图标和标题

<code src="./demo/customIcon.tsx"></code>

### 文件类型限制

<code src="./demo/fileTypes.tsx"></code>

### 上传进度和状态

<code src="./demo/uploadStatus.tsx"></code>

### 多文件上传

<code src="./demo/multipleFiles.tsx"></code>

### 图片预览上传

<code src="./demo/imageUpload.tsx"></code>

## API

### CustomDraggerUpload

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| title | 自定义上传区域标题 | `ReactNode` | `t('common.tips.selectFile')` | - |
| icon | 自定义上传区域图标 | `ReactNode` | `<UploadCloudOutlined />` | - |

### 继承属性

CustomDraggerUpload 组件继承了 Ant Design Upload.Dragger 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| accept | 接受上传的文件类型 | `string` | - | - |
| action | 上传的地址 | `string \| ((file) => string) \| ((file) => Promise<string>)` | - | - |
| beforeUpload | 上传文件之前的钩子 | `(file, fileList) => boolean \| Promise<File \| Blob \| boolean>` | - | - |
| data | 上传时附带的额外参数 | `object \| ((file) => object) \| ((file) => Promise<object>)` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| fileList | 已经上传的文件列表 | `UploadFile[]` | - | - |
| headers | 设置上传的请求头部 | `object` | - | - |
| listType | 上传列表的内建样式 | `'text' \| 'picture' \| 'picture-card'` | `'text'` | - |
| maxCount | 限制最多可以上传多少个文件 | `number` | - | - |
| multiple | 是否支持多选文件 | `boolean` | `false` | - |
| name | 发到后台的文件参数名 | `string` | `'file'` | - |
| showUploadList | 是否显示 uploadList | `boolean \| ShowUploadListInterface` | `true` | - |
| onChange | 上传文件改变时的状态 | `(info: UploadChangeParam) => void` | - | - |
| onDrop | 文件被拖拽时触发 | `(e: React.DragEvent) => void` | - | - |
| onRemove | 点击移除文件时的回调 | `(file: UploadFile) => boolean \| Promise<boolean>` | - | - |

## 设计规范

### 样式特性

- 统一的圆角设计 (`border-radius: 8px`)
- 虚线边框样式 (`border: 1px dashed`)
- 居中对齐的图标和文字
- 基于主题的色彩系统
- 支持悬停、拖拽等交互状态

### 尺寸规范

- **默认高度**: `400px`
- **图标尺寸**: `40px × 40px`
- **标题字体**: `13px, 400 weight`
- **标题行高**: `20px`

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.customDraggerUpload = {
  backgroundColor: string,    // 背景颜色
  color: string,            // 文字颜色
  border: string            // 边框颜色
}
```

### 响应式行为

- 当 `fileList` 有内容时，自动隐藏拖拽区域
- 支持自定义图标和标题内容
- 继承所有 Ant Design Upload 的响应式特性

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `title` 属性支持国际化，默认使用 `t('common.tips.selectFile')`
3. `icon` 属性支持自定义图标，默认使用 `UploadCloudOutlined`
4. 当 `fileList` 有内容时，拖拽区域会自动隐藏
5. 所有 Ant Design Upload.Dragger 的属性和事件都可以正常使用

## 最佳实践

1. **文件类型限制**: 使用 `accept` 属性限制可上传的文件类型
2. **文件大小限制**: 在 `beforeUpload` 中检查文件大小
3. **自定义验证**: 在 `beforeUpload` 中添加业务逻辑验证
4. **错误处理**: 监听 `onChange` 事件处理上传状态变化
5. **用户体验**: 提供清晰的上传提示和进度反馈

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Upload.Dragger 封装
- 支持所有 Upload.Dragger 组件的属性和事件
- 新增 `title` 和 `icon` 属性支持自定义内容
- 统一的样式规范和主题系统集成
- 自动隐藏拖拽区域功能
