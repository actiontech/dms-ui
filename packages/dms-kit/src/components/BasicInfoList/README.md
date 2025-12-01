---
group:
  title: 通用
  order: 1
---

# BasicInfoList 信息列表

基于 Ant Design Card 封装，提供统一的网格布局，用于展示结构化信息。

## 何时使用

- 需要展示结构化信息列表
- 需要响应式网格布局
- 需要统一的错误状态和空状态处理
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 错误和加载状态

<code src="./demo/error.tsx"></code>

## API

BasicInfoList 继承 Ant Design Card 的所有属性，完整 API 请参考 [Card 文档](https://ant.design/components/card-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| data | 信息数据数组 | `BasicInfoDataType[]` | - | ✅ |
| columnNumber | 列数配置 | `number` | `3` | - |
| errorInfo | 错误信息 | `string \| ReactNode` | - | - |
| errorTitle | 错误标题 | `string \| ReactNode` | - | - |
| loading | 加载状态 | `boolean` | `false` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| title | 卡片标题 | `ReactNode` | - | - |
| extra | 卡片右上角操作区 | `ReactNode` | - | - |

### BasicInfoDataType

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| key | 信息标签 | `ReactNode` | - | ✅ |
| value | 信息值 | `ReactNode` | - | ✅ |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **网格布局** → 默认 3 列网格，可自定义列数
3. **自动状态处理** → 自动显示错误、加载、空数据状态
4. **响应式设计** → 最后一行自动调整列宽，保持布局美观

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `data` 是必填属性，至少需要提供空数组
3. `columnNumber` 建议设置为 2-4 之间，以获得最佳显示效果
4. 数据为空或错误时，会自动显示 `BasicEmpty` 组件

## 最佳实践

1. **列数设置**：根据信息复杂度选择列数，简单信息用 3-4 列，复杂信息用 2 列
2. **错误处理**：使用 `errorInfo` 展示错误信息，`errorTitle` 自定义错误标题
3. **加载状态**：异步获取数据时使用 `loading` 状态提升用户体验
4. **信息展示**：key 应简洁明了，value 可使用 ReactNode 展示复杂内容
