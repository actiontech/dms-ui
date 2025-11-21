---
group:
  title: 通用
  order: 1
---

# BasicSegmented 分段控制器

基于 Ant Design Segmented 封装，提供统一的样式规范，用于互斥选项的切换。

## 何时使用

- 在一组互斥且相关的选项中进行选择
- 展示不同视图或模式切换
- 需要与设计系统保持一致
- 替代 Tab 或 Radio 的轻量级切换场景

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 图标模式

<code src="./demo/icon.tsx"></code>

## API

BasicSegmented 继承 Ant Design Segmented 的所有属性，完整 API 请参考 [Segmented 文档](https://ant.design/components/segmented-cn)。

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 分段控制器选项 | `string[] \| number[] \| SegmentedOptions[]` | - | ✅ |
| value | 当前选中的值 | `string \| number` | - | - |
| defaultValue | 默认选中的值 | `string \| number` | - | - |
| onChange | 值变化回调 | `(value: string \| number) => void` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 控制器大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| block | 是否撑满容器 | `boolean` | `false` | - |

## 组件特点

1. **统一样式规范** → 自动应用 ActiontechTable 主题系统的样式
2. **多种尺寸** → 支持 small、middle、large 三种尺寸
3. **图标支持** → 选项可包含图标，增强视觉效果
4. **完整功能** → 继承 Ant Design Segmented 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `options` 是必填属性，至少需要 2 个选项
3. 选项数量建议不超过 5 个，过多会影响用户体验
4. 使用图标模式时，建议配合文字说明提升可读性

## 最佳实践

1. **选项数量**：控制在 2-5 个选项之间，过多建议使用 Select
2. **图标使用**：使用图标可以节省空间，但需确保图标含义清晰
3. **尺寸选择**：页面级切换使用 large，组件内切换使用 middle 或 small
4. **block 属性**：在容器内使用时，设置 `block` 可获得更好的布局效果
