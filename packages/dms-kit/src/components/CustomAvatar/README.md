---
group:
  title: 自定义组件
  order: 11
---

# CustomAvatar 自定义头像

基于 Ant Design Avatar 封装，提供自动文字头像生成和智能提示功能。

## 何时使用

- 需要显示用户头像
- 需要自动生成文字头像（无图片时）
- 需要显示用户姓名提示

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

## API

CustomAvatar 基于 Ant Design Avatar 封装，继承所有 Avatar 属性。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| name | 用户姓名（用于生成文字头像和提示） | `string` | - | - |
| noTips | 是否禁用提示 | `boolean` | `false` | - |
| toolTipsWrapperClassName | 提示框包装器的类名 | `string` | - | - |

### 常用 Avatar 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| src | 头像图片地址 | `string` | - | - |
| size | 头像大小 | `'large' \| 'default' \| 'small' \| number` | `'default'` | - |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` | - |
| icon | 头像图标 | `ReactNode` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **自动文字头像** → 无图片时自动提取姓名首字符生成文字头像
3. **智能提示** → 鼠标悬停显示完整用户姓名
4. **灵活尺寸** → 支持预设尺寸（small/default/large）和自定义数字尺寸
5. **完全兼容** → 继承 Ant Design Avatar 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `name` 属性用于生成文字头像，建议提供有意义的用户名
3. `src` 属性优先级高于 `name` 属性
4. 文字头像自动提取姓名首字符并转为大写

## 最佳实践

1. **命名规范**：使用真实用户名，便于生成识别度高的文字头像
2. **图片优化**：提供合适尺寸的头像图片（推荐 2 倍尺寸），避免过大文件
3. **降级处理**：即使使用图片头像，也建议提供 `name` 作为降级方案
4. **尺寸选择**：列表使用 small，详情页使用 large，其他场景使用 default
