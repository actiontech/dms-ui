---
group:
  title: 自定义组件
  order: 10
---

# CustomDraggerUpload 自定义拖拽上传

基于 Ant Design Upload.Dragger 封装，提供统一样式和自定义图标标题。

## 何时使用

- 需要拖拽上传文件
- 需要自定义上传区域的图标和标题
- 需要自动隐藏上传区域（当有文件列表时）

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义图标和标题

<code src="./demo/customIcon.tsx"></code>

## API

CustomDraggerUpload 基于 Ant Design Upload.Dragger 封装，继承所有 Upload.Dragger 属性。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 上传区域标题 | `ReactNode` | `t('common.tips.selectFile')` | - |
| icon | 上传区域图标 | `ReactNode` | `<UploadCloudOutlined />` | - |

### 常用 Upload 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| action | 上传地址 | `string \| Function` | - | ✅ |
| accept | 接受的文件类型 | `string` | - | - |
| fileList | 已上传的文件列表 | `UploadFile[]` | - | - |
| maxCount | 最多上传文件数 | `number` | - | - |
| multiple | 是否支持多选 | `boolean` | `false` | - |
| beforeUpload | 上传前的钩子 | `(file, fileList) => boolean \| Promise` | - | - |
| onChange | 文件状态改变回调 | `(info: UploadChangeParam) => void` | - | - |
| onRemove | 移除文件回调 | `(file: UploadFile) => boolean \| Promise` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **拖拽上传** → 支持点击和拖拽两种方式上传文件
3. **自定义图标** → 支持自定义上传区域的图标和标题
4. **自动隐藏** → 当 fileList 有内容时，拖拽区域自动隐藏
5. **完全兼容** → 继承 Ant Design Upload.Dragger 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `title` 属性支持国际化，默认使用 `t('common.tips.selectFile')`
3. `action` 是必填属性，需要提供上传地址
4. 当 `fileList` 有内容时，拖拽区域会自动隐藏

## 最佳实践

1. **文件类型限制**：使用 `accept` 属性限制可上传的文件类型
2. **文件大小限制**：在 `beforeUpload` 中检查文件大小，避免上传超大文件
3. **自定义验证**：在 `beforeUpload` 中添加业务逻辑验证（如文件名格式）
4. **错误处理**：监听 `onChange` 事件，根据 status 处理上传状态
