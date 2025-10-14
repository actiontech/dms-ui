---
group:
  title: 自定义组件
  order: 11
---

# CustomAvatar 自定义头像

基于 Ant Design Avatar 组件封装的自定义头像组件，提供了统一的样式规范和增强的功能特性，包括自动生成文字头像和智能提示。

## 何时使用

- 需要显示用户头像时
- 需要自动生成文字头像（当没有图片时）时
- 需要显示用户姓名提示时
- 需要保持与设计系统一致的头像组件样式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 头像尺寸

<code src="./demo/sizes.tsx"></code>



## API

### CustomAvatar

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| name | 用户姓名，用于生成文字头像和提示 | `string` | - | - |
| src | 头像图片地址 | `string` | - | - |
| noTips | 是否禁用提示 | `boolean` | `false` | - |
| size | 头像大小 | `'large' \| 'default' \| 'small' \| number` | `'default'` | - |
| toolTipsWrapperClassName | 提示框包装器的类名 | `string` | - | - |

### 继承属性

CustomAvatar 组件继承了 Ant Design Avatar 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| alt | 图片无法显示时的替代文本 | `string` | - | - |
| gap | 字符类型头像之间的距离 | `number` | `4` | - |
| icon | 设置头像的图标类型 | `ReactNode` | - | - |
| shape | 指定头像的形状 | `'circle' \| 'square'` | `'circle'` | - |
| className | 头像类名 | `string` | - | - |
| style | 头像样式 | `CSSProperties` | - | - |

## 设计规范

### 样式特性

- 统一的圆形设计 (`border-radius: 50%`)
- 自动文字头像生成
- 基于主题的色彩系统
- 智能提示功能集成
- 响应式尺寸支持

### 尺寸规范

- **大尺寸 (large)**: `40px × 40px`
- **默认尺寸 (default)**: `32px × 32px`  
- **小尺寸 (small)**: `24px × 24px`
- **自定义尺寸**: 支持数字值

### 文字头像规范

- 自动提取姓名的第一个字符
- 转换为大写字母显示
- 使用主题色彩系统
- 默认背景色: `#fde3cf`
- 默认文字色: `#f56a00`

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.customAvatar = {
  backgroundColor: string,    // 文字头像背景色
  color: string,            // 文字头像文字色
  hoverColor: string        // 悬停状态颜色
}
```

## 功能特性

### 自动文字头像

当没有提供 `src` 属性时，组件会自动：
1. 提取 `name` 属性的第一个字符
2. 转换为大写字母
3. 应用默认的文字头像样式
4. 显示在圆形背景中

### 智能提示

- 默认显示用户姓名提示
- 可通过 `noTips` 属性禁用
- 支持自定义提示框样式
- 基于 BasicToolTip 组件实现

### 响应式支持

- 支持所有标准头像尺寸
- 自动适应容器大小
- 保持宽高比例
- 支持自定义尺寸值

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `name` 属性用于生成文字头像，建议提供有意义的用户名
3. `src` 属性优先级高于 `name` 属性
4. 文字头像会自动提取姓名的第一个字符
5. 提示功能基于 BasicToolTip 组件，确保依赖正确

## 最佳实践

1. **命名规范**: 使用有意义的用户名，便于生成文字头像
2. **图片优化**: 提供适当尺寸的头像图片，避免过大文件
3. **提示内容**: 在需要时显示用户完整信息
4. **尺寸选择**: 根据使用场景选择合适的头像尺寸
5. **样式一致性**: 保持与整体设计系统的风格一致

## 更新日志

- **1.0.0**: 初始版本，基于 Ant Design Avatar 封装
- 支持所有 Avatar 组件的属性和事件
- 新增 `name` 属性支持自动文字头像生成
- 新增 `noTips` 属性控制提示显示
- 集成 BasicToolTip 组件提供智能提示
- 统一的样式规范和主题系统集成