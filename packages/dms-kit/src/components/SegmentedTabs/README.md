---
group:
  title: 展示组件
  order: 16
---

# SegmentedTabs 分段标签页

基于 Ant Design Segmented 和 LazyLoadComponent 封装，提供分段式标签页和懒加载功能。

## 何时使用

- 需要分段式标签页进行内容分类展示
- 需要懒加载标签页内容以提高性能
- 需要动态切换不同内容区域
- 需要支持额外内容区域的标签页

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

## API

SegmentedTabs 基于 Ant Design Segmented 和 LazyLoadComponent 封装。

### 组件属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| items | 标签页配置数组 | `Array<ItemsType>` | - | ✅ |
| activeKey | 当前选中的标签页 | `string \| number` | - | - |
| onChange | 切换标签页回调 | `(key: string \| number) => void` | - | - |
| defaultActiveKey | 默认选中的标签页 | `string \| number` | `items[0]?.value` | - |
| animated | 标签页切换动画效果 | `string \| false` | `false` | - |
| segmentedRowExtraContent | 分段控制器右侧的额外内容 | `ReactNode` | - | - |
| rootClassName | 最外层自定义类名 | `string` | - | - |
| segmentedRowClassName | 分段控制器行自定义类名 | `string` | - | - |

### ItemsType

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| label | 标签文本 | `ReactNode` | - | ✅ |
| value | 标签值 | `string \| number` | - | ✅ |
| children | 标签页内容 | `ReactNode` | - | - |
| icon | 标签图标 | `ReactNode` | - | - |
| forceRender | 隐藏时是否渲染 DOM | `boolean` | `false` | - |
| destroyInactivePane | 切换时是否销毁 DOM | `boolean` | `false` | - |
| className | 标签自定义类名 | `string` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **懒加载支持** → 基于 LazyLoadComponent 实现性能优化
3. **灵活配置** → 支持 forceRender、destroyInactivePane、animated
4. **额外内容** → 支持在分段控制器右侧显示额外内容

## 懒加载配置

SegmentedTabs 基于 LazyLoadComponent 实现懒加载，每个 tab 项支持独立配置：

- **forceRender**：提前渲染内容但初始隐藏（对应 LazyLoadComponent.forceRender）
- **destroyInactivePane**：切换时自动销毁，释放资源（对应 LazyLoadComponent.destroyOnClose）
- **animated**：统一配置所有 tab 的动画效果（对应 LazyLoadComponent.animation）

**详细说明**：关于这些属性的完整功能说明、使用场景和最佳实践，请参考 [LazyLoadComponent 文档](/components/lazy-load-component)

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `items` 数组必须包含有效的 `value` 和 `children` 属性
3. `destroyInactivePane` 对应 LazyLoadComponent 的 `destroyOnClose`，功能相同但命名不同
4. 关于懒加载属性的详细注意事项，请参考 [LazyLoadComponent 文档](/components/lazy-load-component#注意事项)

## 最佳实践

1. **性能优化**：重型组件（图表、视频）使用 `destroyInactivePane` 释放资源，频繁切换的标签不使用
2. **预加载**：常用标签页使用 `forceRender` 提前渲染，提升切换响应速度
3. **状态管理**：需要重置的表单使用 `destroyInactivePane`，需要保持状态的编辑器不使用
4. **动画效果**：使用 `animated` 提供平滑过渡，需要在全局样式中定义对应的 `@keyframes`
