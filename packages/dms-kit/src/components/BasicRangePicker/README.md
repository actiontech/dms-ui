---
group:
  title: 通用
  order: 1
---

# BasicRangePicker 基础日期范围选择器组件

## 组件介绍

BasicRangePicker 是一个基于 Ant Design RangePicker 组件封装的基础日期范围选择器，提供了统一的样式风格、自定义分隔符、前缀图标等功能。它是 dms-kit 中常用的日期范围输入组件。

## 何时使用

- 需要选择日期范围时（如开始日期到结束日期）
- 需要统一的日期范围选择器样式风格
- 需要自定义分隔符和清除图标的日期范围选择器
- 需要前缀图标的日期范围输入框

## 代码演示

### 基础用法

最简单的日期范围选择器用法，支持基本的日期范围选择功能。

<code src="./demos/basic.tsx"></code>

### 不同尺寸

支持三种尺寸：small、middle、large。

<code src="./demos/size.tsx"></code>

### 自定义格式

支持自定义日期显示格式和输入格式。

<code src="./demos/format.tsx"></code>

### 禁用状态

当不需要用户输入时，可以禁用日期范围选择器。通过设置 `disabled` 属性为 `true` 即可禁用组件。

### 范围限制

可以设置日期的选择范围，限制用户只能选择特定时间段的日期。通过 `disabledDate` 属性可以禁用指定的日期。

### 前缀图标

通过 prefix 属性添加前缀图标，当同时存在 suffixIcon 和 prefix 时，prefix 会被覆盖。

<code src="./demos/prefix.tsx"></code>

### 自定义分隔符

使用自定义的分隔符图标，默认为右箭头图标。

<code src="./demos/separator.tsx"></code>

### 显示超级图标

控制是否显示年份和月份的快速跳转按钮。通过 `hideSuperIcon` 属性控制，默认为 `true`（隐藏）。

### 自定义样式

通过 className 属性添加自定义样式类。

## API 文档

### BasicRangePickerProps

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| prefix | 前缀图标，当 suffixIcon 存在时会被覆盖 | ReactNode | - | - |
| hideSuperIcon | 是否隐藏年份和月份的快速跳转按钮 | boolean | true | - |
| className | 自定义 CSS 类名 | string | - | - |

### 继承属性

BasicRangePicker 继承了 Ant Design RangePicker 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | 当前选中的日期范围 | [Dayjs, Dayjs] | - | - |
| defaultValue | 默认选中的日期范围 | [Dayjs, Dayjs] | - | - |
| onChange | 日期范围变化回调 | (dates: [Dayjs, Dayjs] \| null, dateStrings: [string, string]) => void | - | - |
| placeholder | 输入框提示文字 | [string, string] | - | - |
| format | 日期格式 | string | 'YYYY-MM-DD' | - |
| size | 输入框大小 | 'large' \| 'middle' \| 'small' | 'middle' | - |
| disabled | 是否禁用 | boolean | false | - |
| allowClear | 是否显示清除按钮 | boolean | true | - |
| showTime | 是否显示时间选择 | boolean \| object | false | - |
| disabledDate | 不可选择的日期 | (current: Dayjs) => boolean | - | - |
| onOpenChange | 弹出层展开/收起回调 | (open: boolean) => void | - | - |
| separator | 分隔符 | ReactNode | \<RightOutlined \/\> | - |

## 设计规范

### 样式特点

- **统一边框**: 使用主题的边框色，hover 和 focus 状态有相应的边框变化
- **自定义分隔符**: 默认使用右箭头图标作为日期范围分隔符
- **清除图标**: 使用自定义的关闭图标，支持主题色配置
- **前缀图标**: 支持添加前缀图标，与 suffixIcon 互斥
- **圆角设计**: 输入框使用 4px 圆角，保持与其他组件的一致性

### 主题配置

BasicRangePicker 支持以下主题变量：

```less
// 日期范围选择器样式变量
@color-border: #d9d9d9;
@color-bg-layout: #fafafa;
@color-default-icon: #8c8c8c;

// 状态样式
@basic-range-picker-default-border: 1px solid #d9d9d9;
@basic-range-picker-hover-border: 1px solid #40a9ff;
@basic-range-picker-active-border: 1px solid #1890ff;
@basic-range-picker-error-border: 1px solid #ff4d4f;
@basic-range-picker-disabled-border: 1px solid #d9d9d9;

// 占位符样式
@basic-range-picker-default-placeholder-color: #bfbfbf;
```

### 交互状态

- **默认状态**: 使用主题的默认边框色
- **悬停状态**: 边框色变为主题色，有平滑的过渡动画
- **聚焦状态**: 边框色为主题色，显示聚焦轮廓
- **错误状态**: 边框色为错误色，用于表单验证失败时
- **禁用状态**: 边框色为禁用色，背景色为禁用背景色

### 布局特点

- **前缀图标**: 当存在 prefix 且没有 suffixIcon 时，prefix 会显示在右侧
- **分隔符**: 日期范围之间的分隔符使用右箭头图标
- **清除按钮**: 清除按钮使用自定义的关闭图标
- **导航按钮**: 左右箭头按钮使用自定义图标，支持主题色配置

## 注意事项

1. **图标依赖**: 组件依赖 `@actiontech/icons` 包中的图标组件
2. **日期格式**: 默认使用 dayjs 处理日期，确保项目中已安装 dayjs
3. **主题系统**: 组件使用 MUI 的 styled 系统，需要正确的主题上下文
4. **前缀图标**: 当同时存在 suffixIcon 和 prefix 时，prefix 会被 suffixIcon 覆盖
5. **弹出层定位**: 下拉面板的定位容器为触发器本身，避免定位问题
6. **国际化**: 日期格式和文本支持国际化配置

## 更新日志

### 1.0.0
- 初始版本发布
- 支持基础日期范围选择功能
- 集成自定义分隔符和清除图标
- 支持前缀图标显示
- 自定义导航按钮样式
- 支持超级图标显示控制
