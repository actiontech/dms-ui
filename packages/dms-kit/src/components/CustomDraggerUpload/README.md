---
group:
  title: 自定义组件
  order: 10
---

# CustomDraggerUpload 自定义拖拽上传

基于 Ant Design Upload.Dragger 封装，提供统一样式和自定义图标标题的拖拽上传组件。

## 何时使用

- 需要拖拽上传文件
- 需要自定义上传区域的图标和标题
- 需要自动隐藏上传区域（当有文件列表时）
- 需要统一的上传组件样式

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义图标和标题

<code src="./demo/customIcon.tsx"></code>

## API

### CustomDraggerUpload

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 上传区域标题 | `ReactNode` | `t('common.tips.selectFile')` | - |
| icon | 上传区域图标 | `ReactNode` | `<UploadCloudOutlined />` | - |
| accept | 接受的文件类型 | `string` | - | - |
| action | 上传地址 | `string \| Function` | - | ✅ |
| beforeUpload | 上传前的钩子 | `(file, fileList) => boolean \| Promise` | - | - |
| fileList | 已上传的文件列表 | `UploadFile[]` | - | - |
| maxCount | 最多上传文件数 | `number` | - | - |
| multiple | 是否支持多选 | `boolean` | `false` | - |
| onChange | 文件状态改变回调 | `(info: UploadChangeParam) => void` | - | - |
| onRemove | 移除文件回调 | `(file: UploadFile) => boolean \| Promise` | - | - |

继承 Ant Design Upload.Dragger 的所有其他属性，详见 [Upload API](https://ant.design/components/upload-cn#api)

## 组件特点

1. **拖拽上传** → 支持点击和拖拽两种方式上传文件
2. **自定义图标** → 支持自定义上传区域的图标和标题
3. **自动隐藏** → 当 fileList 有内容时，拖拽区域自动隐藏
4. **统一样式** → 提供统一的设计系统样式，圆角虚线边框
5. **完全兼容** → 继承 Ant Design Upload.Dragger 所有功能

## 核心功能详解

### 自定义图标和标题

通过 `icon` 和 `title` 属性自定义上传区域的展示内容：

```typescript
<CustomDraggerUpload
  icon={<CloudUploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />}
  title="点击或拖拽文件到此区域上传"
  action="/api/upload"
/>
```

### 文件类型限制

使用 `accept` 属性限制可上传的文件类型：

```typescript
// 限制为图片
<CustomDraggerUpload
  accept="image/*"
  action="/api/upload"
/>

// 限制为文档
<CustomDraggerUpload
  accept=".doc,.docx,.pdf,.txt"
  action="/api/upload"
/>
```

### 文件大小限制

在 `beforeUpload` 中检查文件大小：

```typescript
const beforeUpload = (file: File) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('文件大小不能超过 2MB!');
    return false;
  }
  return true;
};

<CustomDraggerUpload
  beforeUpload={beforeUpload}
  action="/api/upload"
/>
```

### 自动隐藏上传区域

当 `fileList` 有内容时，拖拽区域会自动隐藏，只显示文件列表：

```typescript
const [fileList, setFileList] = useState<UploadFile[]>([]);

<CustomDraggerUpload
  fileList={fileList}
  onChange={(info) => setFileList(info.fileList)}
  action="/api/upload"
/>
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. `title` 属性支持国际化，默认使用 `t('common.tips.selectFile')`
3. `action` 是必填属性，需要提供上传地址
4. 当 `fileList` 有内容时，拖拽区域会自动隐藏
5. 继承所有 Ant Design Upload.Dragger 的属性和事件

## 最佳实践

1. **文件类型限制**：使用 `accept` 属性限制可上传的文件类型，提升用户体验
2. **文件大小限制**：在 `beforeUpload` 中检查文件大小，避免上传超大文件
3. **自定义验证**：在 `beforeUpload` 中添加业务逻辑验证（如文件名格式）
4. **错误处理**：监听 `onChange` 事件，根据 status 处理上传状态
5. **用户反馈**：使用 message 提示上传成功或失败，提供清晰的状态反馈
