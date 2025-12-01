---
group:
  title: 通用
  order: 1
---

# BasicButton 按钮

基于 Ant Design Button 封装，提供统一的按钮样式和无边框图标按钮支持。

## 何时使用

- 需要统一按钮样式
- 需要无边框图标按钮
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 图标按钮

<code src="./demo/icon.tsx"></code>

## API

BasicButton 继承 Ant Design Button 的所有属性，完整 API 请参考 [Button 文档](https://ant.design/components/button-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| noBorderIcon | 是否为无边框图标按钮 | `boolean` | `false` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| type | 按钮类型 | `'primary' \| 'default' \| 'dashed' \| 'text' \| 'link'` | `'default'` | - |
| size | 按钮大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| loading | 是否加载中 | `boolean` | `false` | - |
| icon | 按钮图标 | `ReactNode` | - | - |
| danger | 是否危险按钮 | `boolean` | `false` | - |
| onClick | 点击回调 | `(event) => void` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **无边框图标按钮** → 通过 `noBorderIcon` 创建无边框图标按钮
3. **完整类型支持** → 支持 primary、default、dashed、text、link 等类型
4. **多种尺寸** → 提供 large、middle、small 三种尺寸

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `noBorderIcon` 属性仅适用于图标按钮，不包含文本内容
3. 危险按钮使用 `danger` 属性，而非 `type="danger"`
4. 加载状态下按钮自动禁用，无需同时设置 `disabled`

## 最佳实践

1. **按钮类型**：主要操作用 `primary`，次要操作用 `default`，危险操作用 `danger`
2. **图标按钮**：纯图标按钮建议使用 `noBorderIcon`，避免视觉干扰
3. **加载状态**：异步操作时使用 `loading` 状态，提升用户体验
4. **禁用状态**：不可用时使用 `disabled`，建议配合 Tooltip 说明原因
