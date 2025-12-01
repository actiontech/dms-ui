---
group:
  title: 通用
  order: 4
---

# BasicSelect 基础选择器

基于 Ant Design Select 封装，提供统一的样式规范、国际化支持和前缀标签功能。

## 何时使用

- 需要统一的选择器样式规范
- 需要国际化占位符支持
- 需要添加前缀标签的场景
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选和搜索

<code src="./demo/multiple.tsx"></code>

### 前缀图标

<code src="./demo/prefix.tsx"></code>

## API

BasicSelect 继承 Ant Design Select 的所有属性，完整 API 请参考 [Select 文档](https://ant.design/components/select-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefix | 选择器前缀（建议使用图标） | `ReactNode` | - | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 数据化配置选项 | `{ label, value }[]` | - | - |
| value | 当前选中的值 | `string \| number \| string[] \| number[]` | - | - |
| defaultValue | 默认选中的值 | `string \| number \| string[] \| number[]` | - | - |
| mode | 选择器模式 | `'multiple' \| 'tags'` | - | - |
| placeholder | 占位符 | `string` | `'请选择'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| allowClear | 是否显示清除按钮 | `boolean` | `false` | - |
| showSearch | 是否支持搜索 | `boolean` | `false` | - |
| loading | 加载状态 | `boolean` | `false` | - |
| onChange | 值变化回调 | `(value, option) => void` | - | - |
| onSearch | 搜索回调 | `(value: string) => void` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **国际化支持** → 占位符自动使用国际化配置
3. **前缀图标** → 支持在选择器左侧添加图标前缀
4. **完整功能** → 继承 Ant Design Select 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 占位符会自动使用国际化配置，无需手动设置
3. `prefix` 建议使用图标，避免文字长度不一的问题
4. 加载状态会显示自定义的 `BasicEmpty` 组件
5. 支持泛型类型，可指定选项值的类型

## 最佳实践

1. **搜索功能**：大量选项时建议启用 `showSearch` 提升用户体验
2. **前缀图标**：使用 `prefix` 属性添加图标，让选择器含义更清晰直观
3. **多选模式**：使用 `mode="multiple"` 实现多选，配合 `maxTagCount` 控制标签显示
4. **异步加载**：数据加载时使用 `loading` 状态展示加载指示器
