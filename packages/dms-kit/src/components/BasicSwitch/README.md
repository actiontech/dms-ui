---
group:
  title: 通用
  order: 1
---

# BasicSwitch 开关

基于 Ant Design Switch 封装，提供统一的样式主题和交互体验，用于状态切换场景。

## 何时使用

- 快速切换功能或设置的开启/关闭状态
- 控制用户权限、系统功能的启用状态
- 在配置页面中切换各种选项
- 作为表单中的布尔值输入控件

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 不同尺寸和状态

<code src="./demos/size.tsx"></code>

### 表单集成

<code src="./demos/form.tsx"></code>

## API

BasicSwitch 继承 Ant Design Switch 的所有属性，完整 API 请参考 [Switch 文档](https://ant.design/components/switch-cn)。

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| checked | 指定当前是否选中 | `boolean` | `false` | - |
| defaultChecked | 默认是否选中 | `boolean` | `false` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| loading | 加载中的开关 | `boolean` | `false` | - |
| size | 开关大小 | `'default' \| 'small'` | `'default'` | - |
| checkedChildren | 选中时的内容 | `ReactNode` | - | - |
| unCheckedChildren | 非选中时的内容 | `ReactNode` | - | - |
| onChange | 变化时回调函数 | `(checked: boolean, event: Event) => void` | - | - |
| onClick | 点击时回调函数 | `(checked: boolean, event: Event) => void` | - | - |

## 组件特点

1. **统一样式主题** → 自动应用 ActiontechTable 主题系统的样式规范
2. **完整状态支持** → 支持加载、禁用、不同尺寸等多种状态
3. **无障碍支持** → 内置 ARIA 属性和键盘导航（Space 键切换）
4. **表单友好** → 可与 Form 组件无缝集成

## 注意事项

1. 在 Form 组件中使用时，必须设置 `valuePropName="checked"`
2. 异步操作期间建议使用 `loading` 状态防止重复操作
3. 避免在 `onChange` 回调中执行耗时操作，影响交互响应
4. 组件支持键盘操作，Space 键可切换状态

## 最佳实践

1. **异步切换**：配合 `loading` 状态展示操作进度，提升用户体验
2. **表单使用**：在 Form.Item 中设置 `valuePropName="checked"` 确保值正确绑定
3. **状态标签**：使用 `checkedChildren` 和 `unCheckedChildren` 让开关含义更清晰
4. **尺寸选择**：紧凑布局使用 `small`，标准场景使用 `default`
