---
group:
  title: 通用
  order: 1
---

# BasicDatePicker 日期选择器

基于 Ant Design DatePicker 封装，提供统一的日期选择器样式和时钟图标前缀。

## 何时使用

- 需要选择单个日期
- 需要时钟图标前缀的日期输入框
- 需要统一的日期选择器样式
- 需要与设计系统保持一致

## 代码演示

### 基础用法

<code src="./demos/basic.tsx"></code>

### 日期范围限制

<code src="./demos/range.tsx"></code>

## API

BasicDatePicker 继承 Ant Design DatePicker 的所有属性，完整 API 请参考 [DatePicker 文档](https://ant.design/components/date-picker-cn)。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| hideSuperIcon | 是否隐藏年份/月份快速跳转按钮 | `boolean` | `true` | - |

### 常用属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | 当前选中的日期 | `Dayjs` | - | - |
| defaultValue | 默认选中的日期 | `Dayjs` | - | - |
| onChange | 日期变化回调 | `(date: Dayjs \| null, dateString: string) => void` | - | - |
| placeholder | 输入框提示文字 | `string` | - | - |
| format | 日期格式 | `string` | `'YYYY-MM-DD'` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| disabledDate | 不可选择的日期 | `(current: Dayjs) => boolean` | - | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **时钟图标前缀** → 左侧显示时钟图标，提升视觉识别度
3. **自定义导航按钮** → 左右箭头按钮使用自定义图标
4. **快速跳转控制** → 通过 `hideSuperIcon` 控制年份/月份快速跳转按钮

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 默认使用 dayjs 处理日期，确保项目中已安装 dayjs
3. `hideSuperIcon` 默认为 `true`，隐藏年份/月份快速跳转按钮
4. 日期格式和文本支持国际化配置

## 最佳实践

1. **日期格式**：根据业务需求选择合适的日期格式，如 `YYYY-MM-DD`、`YYYY/MM/DD`
2. **范围限制**：使用 `disabledDate` 限制可选日期范围，避免用户选择无效日期
3. **默认值**：使用 `defaultValue` 设置默认日期，提升用户体验
4. **清除按钮**：表单场景建议保留 `allowClear`，方便用户清除已选日期
