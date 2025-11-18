---
group:
  title: 交互组件
  order: 20
---

# LazyLoadComponent 懒加载组件

一个轻量级的 React 懒加载容器，支持按需挂载、隐藏与销毁，提供灵活的渲染策略和动画效果。

## 何时使用

- 根据 `open` 控制子组件的挂载与卸载
- 需要优化性能，延迟加载重型组件
- 需要在组件隐藏时释放资源（定时器、事件监听等）
- 需要提前渲染但初始隐藏组件（如预加载）
- 需要为组件显示/隐藏添加过渡动画

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

###  强制渲染

<code src="./demo/forceRender.tsx"></code>

### 动画效果

<code src="./demo/animation.tsx"></code>

**使用说明：**
- 可以使用任何标准的 CSS animation 属性值（如：`fadeIn 0.3s ease-out`）
- 需要在父组件或全局样式中定义对应的 `@keyframes` 动画
- 设置为 `false` 可以禁用动画，实现立即显示/隐藏
- 支持所有 CSS animation 相关属性：duration、timing-function、delay、iteration-count 等

### 销毁组件

<code src="./demo/destroyOnClose.tsx"></code>

## API

| 参数            | 说明                     | 类型                | 默认值  |
| --------------- | ----------------------- | ------------------- | ------- |
| open            | 是否显示组件             | `boolean`           | -       |
| forceRender     | 强制首次渲染但隐藏       | `boolean`           | `false` |
| destroyOnClose  | 关闭时卸载组件           | `boolean`           | `false` |
| animation       | CSS 动画类名或禁用动画   | `string \| false`   | -       |
| className       | 自定义容器类名           | `string`            | -       |
| children        | 渲染内容                 | `ReactNode`         | -       |


## 最佳实践

1. **性能优化**：
   - 对于重型组件，使用 `destroyOnClose` 释放资源
   - 对于频繁切换的组件，不使用 `destroyOnClose` 以避免重复挂载

2. **用户体验**：
   - 使用 `animation` 提供平滑的过渡效果
   - 对于首屏关键内容，考虑使用 `forceRender` 预加载

3. **资源管理**：
   - 有定时器、WebSocket 等副作用的组件应使用 `destroyOnClose`
   - 检查浏览器控制台确认组件正确卸载

4. **状态管理**：
   - 需要保持状态的组件不要使用 `destroyOnClose`
   - 需要重置状态的组件（如表单）应使用 `destroyOnClose`

## 注意事项

1. `forceRender` 和 `destroyOnClose` 同时为 `true` 时，组件会在首次渲染，但关闭后会被销毁
2. 动画效果需要在父组件或全局样式中定义对应的 `@keyframes`
3. 使用 `destroyOnClose` 时，组件内部的状态会在关闭时丢失
4. 建议在开发环境中使用 React DevTools 观察组件的挂载/卸载行为

## 更新日志

- **1.0.0**: 初始版本
  - 支持基础的显示/隐藏控制
  - 支持 `forceRender` 强制渲染
  - 支持 `destroyOnClose` 销毁控制
  - 支持自定义 CSS 动画
  - 完整的 TypeScript 类型支持


