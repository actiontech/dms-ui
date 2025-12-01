---
group:
  title: 通用
  order: 1
---

# BasicEmpty 空状态

基于 Ant Design Empty 封装，提供统一的空状态、加载状态和错误状态展示。

## 何时使用

- 需要展示空数据状态
- 需要展示加载状态
- 需要展示错误状态
- 需要与设计系统保持一致

## 代码演示

<code src="./demo/basic.tsx"></code>

## API

BasicEmpty 继承 Ant Design Empty 的所有属性，完整 API 请参考 [Empty 文档](https://ant.design/components/empty-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| loading | 是否显示加载状态 | `boolean` | `false` | - |
| dataLength | 数据长度（为 0 时显示空状态） | `number` | - | - |
| errorInfo | 错误信息 | `string \| ReactNode` | - | - |
| errorTitle | 错误标题 | `string \| ReactNode` | - | - |
| emptyCont | 自定义空状态内容 | `string \| ReactNode` | `'暂无数据'` | - |
| onRefresh | 刷新回调函数 | `() => void` | - | - |
| children | 子元素内容 | `ReactNode` | - | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| image | 自定义图片 | `ReactNode` | - | - |
| description | 自定义描述内容 | `ReactNode` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **多状态支持** → 支持加载、错误、空数据三种状态
3. **自动判断** → 通过 `dataLength` 自动判断是否显示空状态
4. **刷新功能** → 支持通过 `onRefresh` 添加刷新按钮

## 状态优先级

组件会按以下优先级显示状态：

1. **loading = true** → 显示加载状态
2. **errorInfo 存在** → 显示错误状态
3. **dataLength = 0** → 显示空状态
4. **其他情况** → 显示 children

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 状态显示遵循优先级：loading > errorInfo > dataLength
3. `onRefresh` 会在错误状态和空状态时显示刷新按钮
4. `children` 仅在非特殊状态时显示（loading、error、empty 状态不显示）

## 最佳实践

1. **数据列表**：配合 `dataLength` 属性自动判断是否显示空状态
2. **错误处理**：使用 `errorInfo` 展示错误信息，配合 `onRefresh` 让用户重试
3. **加载状态**：异步获取数据时使用 `loading` 状态提升用户体验
4. **自定义内容**：使用 `emptyCont` 自定义空状态文案，提供更友好的提示
