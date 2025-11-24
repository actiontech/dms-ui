---
group:
  title: 通用
  order: 1
---

# BasicRangePicker 日期范围选择器

基于 Ant Design RangePicker 封装，提供统一的样式规范，用于选择日期范围。

## 何时使用

- 需要选择日期范围（开始日期到结束日期）
- 需要统一的日期范围选择器样式
- 需要自定义分隔符和前缀图标
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 自定义格式

<code src="./demos/format.tsx"></code>

## API

BasicRangePicker 继承 Ant Design RangePicker 的所有属性，完整 API 请参考 [RangePicker 文档](https://ant.design/components/date-picker-cn#rangepicker)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| prefix | 前缀图标（与 suffixIcon 互斥） | `ReactNode` | - | - |
| hideSuperIcon | 是否隐藏年份快速切换按钮 | `boolean` | `true` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 当前选中的日期范围 | `[Dayjs, Dayjs]` | - | - |
| defaultValue | 默认日期范围 | `[Dayjs, Dayjs]` | - | - |
| onChange | 日期变化回调 | `(dates, dateStrings) => void` | - | - |
| format | 日期格式 | `string` | `'YYYY-MM-DD'` | - |
| placeholder | 输入框提示文字 | `[string, string]` | - | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| allowClear | 是否显示清除按钮 | `boolean` | `true` | - |
| showTime | 是否显示时间选择 | `boolean \| object` | `false` | - |
| disabledDate | 不可选择的日期 | `(current: Dayjs) => boolean` | - | - |
| separator | 分隔符 | `ReactNode` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用 ActiontechTable 主题系统的样式
2. **自定义分隔符** → 默认使用箭头图标，可自定义
3. **前缀图标支持** → 可添加前缀图标，增强视觉效果
4. **完整功能** → 继承 Ant Design RangePicker 所有功能

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 默认使用 dayjs 处理日期，确保项目中已安装 dayjs
3. `prefix` 和 `suffixIcon` 互斥，同时存在时 suffixIcon 优先
4. 使用 `disabledDate` 限制可选日期范围

## 最佳实践

1. **日期格式**：根据业务需求设置合适的 `format`，如日期时间用 `YYYY-MM-DD HH:mm:ss`
2. **范围限制**：使用 `disabledDate` 限制日期范围，避免用户选择无效日期
3. **默认值**：提供合理的 `defaultValue`，如最近一周、最近一个月等
4. **时间选择**：需要精确到时间时，设置 `showTime` 为 true
