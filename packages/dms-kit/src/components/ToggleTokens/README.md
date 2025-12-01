---
group:
  title: 业务工具组件
  order: 13
---

# ToggleTokens 令牌切换

基于 Ant Design Space 封装，支持单选/多选模式的令牌切换组件。

## 何时使用

- 需要对列表数据进行多条件筛选（状态、类型等）
- 需要在互斥选项中进行单一选择
- 需要同时选择多个选项（权限配置、功能开关等）
- 需要更直观的选中状态视觉反馈（复选框样式）

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 多选模式

<code src="./demo/multipleMode.tsx"></code>

### 无样式模式

<code src="./demo/noStyle.tsx"></code>

### 标签字典支持

<code src="./demo/labelDictionary.tsx"></code>

## API

ToggleTokens 基于 Ant Design Space 封装。

### 组件属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| options | 选项配置数组 | `ToggleTokensOptionsType \| string[]` | - | ✅ |
| value | 当前选中的值（受控） | `V \| V[]` | - | - |
| onChange | 值变化回调 | `(val: V \| V[]) => void` | - | - |
| defaultValue | 默认选中的值（非受控） | `V \| V[]` | - | - |
| multiple | 是否支持多选 | `boolean` | `false` | - |
| withCheckbox | 是否显示复选框图标（仅多选模式） | `boolean` | `false` | - |
| noStyle | 是否清空所有默认样式 | `boolean` | `false` | - |
| labelDictionary | 标签字典（用于国际化） | `Record<string, string>` | - | - |
| disabled | 是否禁用所有选项 | `boolean` | `false` | - |
| className | 自定义容器类名 | `string` | - | - |

### ToggleTokensOptionsType

```typescript
type ToggleTokensOptionsType = Array<{
  label: React.ReactNode;
  value: string | number;
  onClick?: (checked: boolean) => void;  // 选项点击回调
  className?: string;
}>;
```

### 继承 Space 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 设置子元素间距 | `'small' \| 'middle' \| 'large'` | `'small'` |
| direction | 子元素排列方向 | `'vertical' \| 'horizontal'` | `'horizontal'` |
| wrap | 是否自动换行 | `boolean` | `false` |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **灵活模式** → 支持单选和多选两种模式
3. **复选框样式** → 多选模式可显示复选框图标，提供更清晰的视觉反馈
4. **样式定制** → 支持 `noStyle` 模式进行完全自定义
5. **国际化支持** → 通过 `labelDictionary` 实现标签转换

## 选择模式

- **单选模式**（`multiple={false}`）：用户只能选中一个选项，适合互斥选择场景
- **多选模式**（`multiple={true}`）：用户可以选中多个选项，适合多条件筛选场景

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `withCheckbox` 仅在多选模式下生效
3. `noStyle` 模式会清空所有默认样式，需要自行定义样式
4. 使用字符串数组作为 `options` 时，可配合 `labelDictionary` 实现国际化

## 最佳实践

1. **模式选择**：根据业务需求选择单选或多选模式
2. **复选框样式**：需要明确选中状态时使用 `withCheckbox`
3. **样式自定义**：需要特殊样式时使用 `noStyle` 模式
4. **国际化**：使用字符串数组 + `labelDictionary` 实现多语言支持
5. **事件处理**：利用 `onClick` 回调处理选项特定的业务逻辑
