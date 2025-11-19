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

### 懒加载配置

<code src="./demo/lazyLoad.tsx"></code>

### 额外内容区域

<code src="./demo/extraContent.tsx"></code>

### 动画效果

<code src="./demo/animation.tsx"></code>

**动画配置说明：**

`animated` 属性用于控制标签页切换时的动画效果。支持任何标准的 CSS animation 属性值或设置为 `false` 禁用动画。

详细说明和动画示例请参考 [LazyLoadComponent 动画效果文档](/components/lazy-load-component#动画效果)

<!-- ### 复杂配置

<code src="./demo/complexConfig.tsx"></code> -->

## API

### SegmentedTabs

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| items | 配置选项卡内容数组 | `Array<ItemsType<T>>` | - | - |
| activeKey | 当前选中的标签页 | `T` | - | - |
| onChange | 切换标签页的回调函数 | `(key: T) => void` | - | - |
| defaultActiveKey | 默认选中的标签页 | `T` | `items[0]?.value` | - |
| animated | 标签页内容切换的动画效果（对应 LazyLoadComponent.animation） | `string \| false` | `false` | - |
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
| forceRender | 被隐藏时是否渲染 DOM 结构（对应 LazyLoadComponent.forceRender） | `boolean` | `false` | - |
| destroyInactivePane | 切换到其他标签时是否销毁 DOM 结构（对应 LazyLoadComponent.destroyOnClose） | `boolean` | `false` | - |

### 类型定义

```typescript
// 泛型类型，支持 string 或 number 类型的值
type SegmentedTabsProps<T extends string | number = string> = {
  items: Array<ItemsType<T>>;
  activeKey?: T;
  onChange?: (key: T) => void;
  defaultActiveKey?: T;
  animated?: string | false;  // CSS animation 属性值或 false
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

SegmentedTabs 基于 LazyLoadComponent 组件实现懒加载功能，每个 tab 项支持独立配置：

- **forceRender**：通过 CSS `display` 控制显隐，提前渲染内容（对应 LazyLoadComponent 的 `forceRender`）
- **destroyInactivePane**：切换时自动销毁，释放资源（对应 LazyLoadComponent 的 `destroyOnClose`）

animated配置是统一配置所有tab动画效果：
- **animated**：可配置的动画效果（对应 LazyLoadComponent 的 `animation`）


**详细说明**：关于这些属性的完整功能说明、使用场景和最佳实践，请参考 [LazyLoadComponent 文档](/components/lazy-load-component)

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
3. `destroyInactivePane` 对应 LazyLoadComponent 的 `destroyOnClose` 属性，使用时请注意两者功能相同但命名不同
4. 关于 `forceRender`、`destroyInactivePane` 和 `animated` 的详细注意事项，请参考 [LazyLoadComponent 文档](/components/lazy-load-component)
5. 额外内容区域会影响分段控制器的布局，注意内容宽度控制

## 最佳实践

### 1. 性能优化

**合理使用 `forceRender`**：
```typescript
// ✅ 推荐：首屏关键内容使用 forceRender
{ label: '概览', value: 'overview', forceRender: true, children: <Overview /> }

// ❌ 避免：所有标签都使用 forceRender
items.map(item => ({ ...item, forceRender: true }))
```

**合理使用 `destroyInactivePane`**：
```typescript
// ✅ 推荐：重型组件使用 destroyInactivePane
{ 
  label: '实时监控', 
  value: 'monitor', 
  destroyInactivePane: true,  // 释放视频/图表资源
  children: <RealtimeMonitor /> 
}

// ✅ 推荐：需要重置的表单
{ 
  label: '新建表单', 
  value: 'form', 
  destroyInactivePane: true,  // 每次打开都是全新表单
  children: <CreateForm /> 
}

// ❌ 避免：需要保持状态的组件
{ 
  label: '编辑器', 
  value: 'editor', 
  destroyInactivePane: false,  // 保留用户编辑内容
  children: <Editor /> 
}
```

### 2. 典型配置场景

**场景 1：数据展示页面**
```typescript
const items = [
  { label: '列表', value: 'list', children: <List /> },  // 默认配置
  { label: '图表', value: 'chart', destroyInactivePane: true, children: <Chart /> }  // 释放图表资源
];
```

**场景 2：设置页面**
```typescript
const items = [
  { label: '基础设置', value: 'basic', forceRender: true, children: <BasicSettings /> },  // 预加载
  { label: '高级设置', value: 'advanced', children: <AdvancedSettings /> }  // 按需加载
];
```

**场景 3：表单页面**
```typescript
const items = [
  { label: '新建', value: 'create', destroyInactivePane: true, children: <CreateForm /> },  // 每次重置
  { label: '编辑', value: 'edit', children: <EditForm /> }  // 保持状态
];
```

### 3. 其他最佳实践

**内容管理**: 避免在标签页内容中放置过于复杂的组件

**状态管理**: 利用 `onChange` 回调管理标签页状态

**样式定制**: 通过类名属性进行样式定制，保持主题一致性

**响应式设计**: 考虑在不同屏幕尺寸下的显示效果

**更多最佳实践**: 关于懒加载和动画的更多最佳实践，请参考 [LazyLoadComponent 文档](/components/lazy-load-component#最佳实践)

## 更新日志

- **1.0.0**: 初始版本，基于 BasicSegmented 和 LazyLoadComponent 封装
- 支持分段式标签页内容切换
- 集成懒加载功能，提升性能
- 支持动画效果和额外内容区域
- 统一的样式规范和主题系统集成
- 完整的 TypeScript 类型支持
- 支持受控和非受控模式
