---
group:
  title: 自定义组件
  order: 11
---

# CustomAvatar 自定义头像

基于 Ant Design Avatar 封装，提供自动文字头像生成和智能提示功能的头像组件。

## 何时使用

- 需要显示用户头像
- 需要自动生成文字头像（无图片时）
- 需要显示用户姓名提示
- 需要统一的头像样式

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

## API

### CustomAvatar

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| name | 用户姓名，用于生成文字头像和提示 | `string` | - | - |
| src | 头像图片地址 | `string` | - | - |
| noTips | 是否禁用提示 | `boolean` | `false` | - |
| size | 头像大小 | `'large' \| 'default' \| 'small' \| number` | `'default'` | - |
| toolTipsWrapperClassName | 提示框包装器的类名 | `string` | - | - |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` | - |
| icon | 头像图标 | `ReactNode` | - | - |

继承 Ant Design Avatar 的所有其他属性，详见 [Avatar API](https://ant.design/components/avatar-cn#api)

## 组件特点

1. **自动文字头像** → 无图片时自动提取姓名首字符生成文字头像
2. **智能提示** → 鼠标悬停显示完整用户姓名
3. **灵活尺寸** → 支持预设尺寸（small/default/large）和自定义数字尺寸
4. **统一样式** → 提供统一的设计系统样式和主题色彩
5. **完全兼容** → 继承 Ant Design Avatar 所有功能

## 核心功能详解

### 自动文字头像

当没有提供 `src` 时，组件会自动生成文字头像：

```typescript
// 自动提取 "张" 作为头像内容
<CustomAvatar name="张三" />

// 自动提取 "A" 作为头像内容
<CustomAvatar name="Admin" />
```

文字头像特性：
- 自动提取姓名的第一个字符
- 转换为大写字母显示
- 使用主题色彩系统（默认：背景 `#fde3cf`，文字 `#f56a00`）

### 智能提示功能

组件默认集成 BasicToolTip，鼠标悬停显示完整姓名：

```typescript
// 默认显示提示
<CustomAvatar name="张三" />

// 禁用提示
<CustomAvatar name="张三" noTips />

// 自定义提示样式
<CustomAvatar 
  name="张三" 
  toolTipsWrapperClassName="custom-tooltip"
/>
```

### 尺寸配置

支持预设尺寸和自定义数字尺寸：

```typescript
// 预设尺寸
<CustomAvatar name="张三" size="small" />   // 24x24px
<CustomAvatar name="张三" size="default" /> // 32x32px
<CustomAvatar name="张三" size="large" />   // 40x40px

// 自定义尺寸
<CustomAvatar name="张三" size={64} />      // 64x64px
<CustomAvatar name="张三" size={100} />     // 100x100px
```

### 图片头像

提供 `src` 属性后，优先显示图片头像：

```typescript
<CustomAvatar 
  src="https://example.com/avatar.jpg"
  name="张三"  // 图片加载失败时作为降级
/>
```

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中使用
2. `name` 属性用于生成文字头像，建议提供有意义的用户名
3. `src` 属性优先级高于 `name` 属性
4. 文字头像自动提取姓名首字符并转为大写
5. 提示功能基于 BasicToolTip 组件实现

## 最佳实践

1. **命名规范**：使用真实用户名，便于生成识别度高的文字头像
2. **图片优化**：提供合适尺寸的头像图片（推荐 2 倍尺寸），避免过大文件
3. **降级处理**：即使使用图片头像，也建议提供 `name` 作为降级方案
4. **尺寸选择**：列表使用 small，详情页使用 large，其他场景使用 default
5. **提示控制**：在密集展示场景（如用户列表）考虑使用 `noTips` 避免干扰
