---
group:
  title: 交互组件
  order: 20
---

# LazyLoadComponent 组件

一个轻量级的 React 懒加载容器，支持按需挂载、隐藏与销毁。

## 何时使用

- 根据 `open` 控制子组件的挂载与卸载
- 需要隐藏但保留 DOM 或完全销毁以释放资源

## 基础示例

<code src="./demo/basic.tsx"></code>

## 切换显隐时重新渲染
<code src="./demo/advanced.tsx"></code>

## API

| 参数            | 说明                     | 类型                | 默认值  |
| --------------- | ----------------------- | ------------------- | ------- |
| open            | 是否显示组件             | `boolean`           | -       |
| forceRender     | 强制首次渲染但隐藏       | `boolean`           | `false` |
| destroyOnClose  | 关闭时卸载组件           | `boolean`           | `false` |
| animation       | CSS 动画类名或禁用动画   | `string`  | `false` | -       |
| className       | 自定义容器类名           | `string`            | -       |
| children        | 渲染内容                 | `ReactNode`         | -       |


