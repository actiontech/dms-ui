---
group:
  title: 交互组件
  order: 20
---

# LazyLoadComponent 懒加载组件

React 懒加载容器，支持按需挂载、隐藏与销毁，提供灵活的渲染策略。

## 何时使用

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

### 销毁组件

<code src="./demo/destroyOnClose.tsx"></code>

## API

| 参数            | 说明                     | 类型                | 默认值  | 必填 |
| --------------- | ----------------------- | ------------------- | ------- | ---- |
| open            | 是否显示组件             | `boolean`           | -       | - |
| forceRender     | 强制首次渲染但隐藏       | `boolean`           | `false` | - |
| destroyOnClose  | 关闭时卸载组件           | `boolean`           | `false` | - |
| animation       | CSS 动画或禁用动画       | `string \| false`   | -       | - |
| className       | 自定义容器类名           | `string`            | -       | - |
| children        | 渲染内容                 | `ReactNode`         | -       | - |

## 组件特点

1. **按需加载** → 根据 `open` 控制子组件的挂载与卸载
2. **性能优化** → 使用 `destroyOnClose` 释放重型组件资源
3. **预加载支持** → 使用 `forceRender` 提前渲染但初始隐藏
4. **动画效果** → 支持自定义 CSS 动画，提供平滑过渡

## 动画配置

`animation` 属性支持：
- 使用标准 CSS animation 属性值（如：`fadeIn 0.3s ease-out`）
- 需要在父组件或全局样式中定义对应的 `@keyframes` 动画
- 设置为 `false` 可禁用动画，实现立即显示/隐藏
- 支持所有 CSS animation 相关属性：duration、timing-function、delay 等

## 注意事项

1. `forceRender` 和 `destroyOnClose` 同时为 `true` 时，组件会在首次渲染，但关闭后会被销毁
2. 动画效果需要在父组件或全局样式中定义对应的 `@keyframes`
3. 使用 `destroyOnClose` 时，组件内部的状态会在关闭时丢失
4. 建议在开发环境中使用 React DevTools 观察组件的挂载/卸载行为

## 最佳实践

1. **性能优化**：重型组件使用 `destroyOnClose` 释放资源，频繁切换的组件不使用以避免重复挂载
2. **用户体验**：使用 `animation` 提供平滑的过渡效果，需要快速响应的组件使用 `forceRender` 预加载
3. **资源管理**：有定时器、WebSocket 等副作用的组件应使用 `destroyOnClose`
4. **状态管理**：需要保持状态的组件不要使用 `destroyOnClose`，需要重置状态的组件（如表单）应使用 `destroyOnClose`
