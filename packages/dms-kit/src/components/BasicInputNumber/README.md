---
group:
  title: 通用
  order: 3
---

# BasicInputNumber 数字输入框

基于 Ant Design InputNumber 封装，提供统一的样式规范，用于数字输入场景。

## 何时使用

- 需要输入数字、金额、百分比等数值
- 需要限制数字范围或精度
- 需要格式化数字显示
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 格式化显示

<code src="./demo/formatter.tsx"></code>

## API

BasicInputNumber 继承 Ant Design InputNumber 的所有属性，完整 API 请参考 [InputNumber 文档](https://ant.design/components/input-number-cn)。

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 当前值 | `number` | - | - |
| defaultValue | 默认值 | `number` | - | - |
| min | 最小值 | `number` | `-Infinity` | - |
| max | 最大值 | `number` | `Infinity` | - |
| step | 每次改变步数 | `number` | `1` | - |
| precision | 数值精度（小数位数） | `number` | - | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'large'` | - |
| formatter | 格式化显示 | `(value) => string` | - | - |
| parser | 解析输入值 | `(value: string) => number` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| placeholder | 占位符 | `string` | - | - |
| addonBefore | 前置标签 | `ReactNode` | - | - |
| addonAfter | 后置标签 | `ReactNode` | - | - |
| onChange | 值变化回调 | `(value) => void` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **默认大尺寸** → 默认使用 large 尺寸，提升用户体验
3. **精度控制** → 支持通过 `precision` 控制小数位数
4. **格式化显示** → 支持自定义数字格式（如金额、百分比）

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 默认尺寸为 `large`，与其他基础组件保持一致
3. 使用 `formatter` 时必须配合 `parser` 使用，确保值的正确转换
4. `precision` 控制小数位数，`step` 控制每次增减的步长

## 最佳实践

1. **范围限制**：使用 `min` 和 `max` 限制输入范围，避免无效输入
2. **精度控制**：金额类使用 `precision={2}`，百分比使用 `precision={0}`
3. **格式化显示**：使用 `formatter` 和 `parser` 实现千分位、货币符号等格式
4. **步长设置**：根据业务需求设置合理的 `step`，如金额用 0.01，数量用 1
