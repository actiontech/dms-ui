---
group:
  title: 通用
  order: 1
---

# BasicTag 标签

基于 Ant Design Tag 封装，提供统一的样式主题和丰富的颜色选项，用于标记和分类。

## 何时使用

- 标记任务状态、订单状态等
- 对内容进行分类标识
- 显示已选择的筛选条件
- 展示标签云或关键词

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 不同颜色

<code src="./demos/color.tsx"></code>

### 不同尺寸

<code src="./demos/size.tsx"></code>

## API

BasicTag 继承 Ant Design Tag 的所有属性，完整 API 请参考 [Tag 文档](https://ant.design/components/tag-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| size | 标签尺寸 | `'small' \| 'default' \| 'large'` | `'default'` | - |
| color | 标签颜色 | `BasicTagColor` | `'default'` | - |

### BasicTagColor

支持的颜色类型：

```typescript
type BasicTagColor = 
  | 'default' | 'red' | 'orange' | 'gold' 
  | 'green' | 'cyan' | 'blue' | 'geekblue' 
  | 'purple' | 'Grape' | 'lilac' | 'gray';
```

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| children | 标签内容 | `ReactNode` | - | ✅ |
| closable | 是否可关闭 | `boolean` | `false` | - |
| onClose | 关闭时的回调 | `(e) => void` | - | - |
| icon | 设置图标 | `ReactNode` | - | - |

## 组件特点

1. **尺寸扩展** → 提供 small、default、large 三种尺寸
2. **丰富配色** → 预设 12 种颜色主题，统一视觉风格
3. **主题适配** → 自动适配主题系统的颜色配置

## 注意事项

1. `size` 属性是 BasicTag 的扩展功能，不是标准 Ant Design Tag 属性
2. `color` 属性使用预设颜色时会应用主题系统的配色
3. 避免在一个区域放置过多标签，影响可读性
4. 标签之间建议使用 `Space` 组件管理间距

## 最佳实践

1. **尺寸选择**：紧凑布局使用 `small`，重要标签使用 `large`
2. **颜色语义**：使用颜色传达语义，如 `green` 表示成功，`red` 表示错误
3. **间距控制**：使用 `Space` 组件包裹多个标签，保持一致间距
4. **数量控制**：单行标签不超过 5 个，避免信息过载
