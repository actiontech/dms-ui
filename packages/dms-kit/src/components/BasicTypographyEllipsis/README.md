---
group:
  title: 通用
  order: 2
---

# BasicTypographyEllipsis 文本省略

基于 Ant Design Typography 封装，提供文本省略、Tooltip 和复制功能。

## 何时使用

- 需要在固定宽度容器中显示长文本
- 需要文本超出时自动省略并提供 Tooltip
- 需要为省略的文本提供复制功能

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

## API

BasicTypographyEllipsis 基于 Ant Design Typography.Text 封装。

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| textCont | 文本内容 | `string` | - | ✅ |
| tooltipLimitLength | Tooltip 显示的最大文本长度 | `number` | `500` | - |
| tooltipsMaxWidth | Tooltip 的最大宽度（px） | `number` | `640` | - |
| copyable | 是否显示复制按钮 | `boolean` | `true` | - |
| tooltips | Tooltip 配置 | `EllipsisConfig['tooltip']` | `true` | - |
| className | 自定义类名 | `string` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **自动省略** → 文本超出容器宽度时自动显示省略号
3. **Tooltip 支持** → 鼠标悬停查看完整内容
4. **长度限制** → Tooltip 内容过长时自动截断，避免影响体验
5. **复制功能** → 支持一键复制完整文本

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. **外层容器必须设置 `max-width`**，否则文本不会省略
3. `tooltipLimitLength` 用于限制 Tooltip 显示的文本长度，超过部分会显示省略号
4. `tooltipsMaxWidth` 控制 Tooltip 的最大宽度，避免 Tooltip 过宽

## 最佳实践

1. **容器宽度**：外层容器必须设置明确的 `max-width` 或 `width`
2. **长文本场景**：对于超长文本（如日志、错误信息），使用 `tooltipLimitLength` 限制 Tooltip 长度
3. **复制功能**：不需要复制功能时，设置 `copyable={false}` 减少视觉干扰
4. **Tooltip 宽度**：根据内容长度调整 `tooltipsMaxWidth`，确保 Tooltip 不会过宽
