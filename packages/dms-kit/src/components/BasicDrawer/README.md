---
group:
  title: 通用
  order: 3
---

# BasicDrawer 抽屉

基于 Ant Design Drawer 封装，提供统一的抽屉样式和预设尺寸。

## 何时使用

- 需要从侧边滑出内容面板
- 需要展示详细配置或表单
- 需要在不跳转页面的情况下展示更多内容
- 需要与设计系统保持一致

## 代码演示

<code src="./demo/basic.tsx"></code>

## API

BasicDrawer 继承 Ant Design Drawer 的所有属性，完整 API 请参考 [Drawer 文档](https://ant.design/components/drawer-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| showClosedIcon | 是否显示自定义关闭图标 | `boolean` | `true` | - |
| noBodyPadding | 是否移除内容区域的内边距 | `boolean` | `false` | - |
| size | 抽屉尺寸预设 | `'default' \| 'large'` | `'default'` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| open | 抽屉是否可见 | `boolean` | `false` | - |
| title | 标题 | `ReactNode` | - | - |
| width | 宽度 | `string \| number` | `480` (default) / `720` (large) | - |
| placement | 抽屉方向 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | - |
| onClose | 关闭回调 | `(e) => void` | - | - |
| maskClosable | 点击蒙层是否允许关闭 | `boolean` | `false` | - |
| destroyOnClose | 关闭时销毁子元素 | `boolean` | `false` | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **预设尺寸** → 提供 default (480px) 和 large (720px) 两种尺寸
3. **自定义关闭图标** → 通过 `showClosedIcon` 控制关闭图标样式
4. **灵活布局** → 支持 `noBodyPadding` 移除内边距，便于自定义布局

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `size` 属性提供预设尺寸，可通过 `width` 属性覆盖
3. Ant Design v5 使用 `open` 属性替代了 `visible`
4. 抽屉内容应保持简洁，避免信息过载

## 最佳实践

1. **尺寸选择**：简单表单用 default (480px)，复杂表单用 large (720px)
2. **关闭方式**：表单类抽屉建议 `maskClosable={false}`，防止误操作丢失数据
3. **销毁策略**：表单抽屉建议 `destroyOnClose={true}`，确保每次打开都是干净状态
4. **无内边距模式**：使用 `noBodyPadding={true}` 时，需自行管理内容区域的间距
