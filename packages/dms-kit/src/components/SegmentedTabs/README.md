---
group:
  title: 展示组件
  order: 16
---

# SegmentedTabs 分段标签页

基于 Ant Design Segmented 组件和 LazyLoadComponent 封装的分段标签页组件，提供了统一的样式规范和懒加载功能，支持动态内容切换和性能优化。

## 何时使用

- 需要分段式标签页进行内容分类展示时
- 需要懒加载标签页内容以提高性能时
- 需要动态切换不同内容区域时
- 需要保持与设计系统一致的标签页样式时
- 需要支持额外内容区域的标签页时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 动态内容切换

<code src="./demo/dynamicContent.tsx"></code>

### 额外内容区域

<code src="./demo/extraContent.tsx"></code>

### 动画效果

<code src="./demo/animation.tsx"></code>

### 复杂配置

<code src="./demo/complexConfig.tsx"></code>

## API

### SegmentedTabs

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 配置选项卡内容数组 | `Array<ItemsType<T>>` | - | - |
| activeKey | 当前选中的标签页 | `T` | - | - |
| onChange | 切换标签页的回调函数 | `(key: T) => void` | - | - |
| defaultActiveKey | 默认选中的标签页 | `T` | `items[0]?.value` | - |
| animated | 标签页内容出现、隐藏的动画效果 | `boolean` | `false` | - |
| rootClassName | 最外层自定义类名 | `string` | - | - |
| segmentedRowClassName | segmented row 自定义类名 | `string` | - | - |
| segmentedRowExtraContent | segmented row 额外内容 | `ReactNode` | - | - |

### ItemsType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| label | segmented option 标签文本 | `ReactNode` | - | - |
| value | segmented option 值 | `T` | - | - |
| icon | segmented option 图标 | `ReactNode` | - | - |
| className | segmented option 自定义类名 | `string` | - | - |
| children | 当前标签页对应的内容 | `ReactNode` | - | - |
| forceRender | 被隐藏时是否渲染 DOM 结构 | `boolean` | `false` | - |
| destroyInactivePane | 被隐藏时是否销毁 DOM 结构 | `boolean` | `false` | - |

### 类型定义

```typescript
// 泛型类型，支持 string 或 number 类型的值
type SegmentedTabsProps<T extends string | number = string> = {
  items: Array<ItemsType<T>>;
  activeKey?: T;
  onChange?: (key: T) => void;
  defaultActiveKey?: T;
  animated?: boolean;
  rootClassName?: string;
  segmentedRowClassName?: string;
  segmentedRowExtraContent?: ReactNode;
};

// 标签页项类型
type ItemsType<T extends string | number = string> = {
  label: ReactNode;
  value: T;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  forceRender?: boolean;
  destroyInactivePane?: boolean;
};
```

### 继承属性

SegmentedTabs 组件继承了 Ant Design Segmented 组件的所有属性，通过 items 数组中的选项进行配置。

## 设计规范

### 样式特性

- 统一的分段控制器样式
- 基于主题的色彩系统
- 支持图标和文本组合
- 响应式布局支持
- 可选的动画效果

### 布局规范

- 分段控制器位于顶部
- 内容区域根据选中状态显示
- 支持额外内容区域
- 统一的间距和对齐
- 懒加载内容管理

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.segmentedTabs = {
  // 继承 BasicSegmented 的主题配置
}
```

## 功能特性

### 分段控制器

- 基于 BasicSegmented 组件实现
- 支持图标、文本和组合显示
- 自动处理选中状态
- 支持受控和非受控模式

### 懒加载优化

- 集成 LazyLoadComponent 组件
- 支持强制渲染和销毁策略
- 可配置的动画效果
- 性能优化的内容管理

### 动态内容切换

- 根据选中标签页动态显示内容
- 支持复杂的内容结构
- 保持组件状态
- 平滑的切换体验

### 额外内容支持

- 在分段控制器右侧显示额外内容
- 支持任意 React 组件
- 灵活的布局配置
- 保持样式一致性

## 使用场景

### 数据展示页面

在数据展示页面中使用分段标签页，将不同类型的数据分类展示。

### 设置页面

在设置页面中使用分段标签页，将不同类别的设置项分组管理。

### 仪表板

在仪表板中使用分段标签页，展示不同维度的统计信息和图表。

### 表单页面

在复杂表单页面中使用分段标签页，将表单字段按功能分组。

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. `items` 数组必须包含有效的 `value` 和 `children` 属性
3. 懒加载功能会影响组件的性能表现，建议根据实际需求配置
4. 动画效果会增加渲染开销，在性能敏感的场景下建议关闭
5. 额外内容区域会影响分段控制器的布局，注意内容宽度控制

## 最佳实践

1. **性能优化**: 合理使用 `forceRender` 和 `destroyInactivePane` 属性
2. **内容管理**: 避免在标签页内容中放置过于复杂的组件
3. **状态管理**: 利用 `onChange` 回调管理标签页状态
4. **样式定制**: 通过类名属性进行样式定制，保持主题一致性
5. **响应式设计**: 考虑在不同屏幕尺寸下的显示效果

## 更新日志

- **1.0.0**: 初始版本，基于 BasicSegmented 和 LazyLoadComponent 封装
- 支持分段式标签页内容切换
- 集成懒加载功能，提升性能
- 支持动画效果和额外内容区域
- 统一的样式规范和主题系统集成
- 完整的 TypeScript 类型支持
- 支持受控和非受控模式
