---
group:
  title: 工具
  order: 2
---

# CronInput Cron 表达式输入

一个功能完整的 Cron 表达式输入组件，支持手动输入和可视化选择两种模式，适用于定时任务配置场景。

## 何时使用

- 需要配置定时任务的 Cron 表达式时
- 需要提供用户友好的 Cron 表达式输入界面时
- 在任务调度、定时备份等场景中使用时
- 需要验证 Cron 表达式格式时

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 手动输入模式

<code src="./demo/manualMode.tsx"></code>

### 禁用状态

<code src="./demo/disabled.tsx"></code>

### 错误处理

<code src="./demo/errorHandling.tsx"></code>

### 自定义频率

<code src="./demo/customFrequency.tsx"></code>

## API

### CronInput

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| value | Cron 表达式的值 | `string` | - | - |
| onChange | 值变化时的回调函数 | `(value: string) => void` | - | - |
| defaultFrequency | 默认频率类型 | `CronFrequencyEnum` | - | - |
| inputMode | 输入模式 | `CronInputModeEnum` | `'Manual'` | - |
| onModeChange | 模式变化时的回调函数 | `(mode: CronInputModeEnum) => void` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| onError | 错误信息回调函数 | `(errorMessage: string) => void` | - | - |

### CronFrequencyEnum

```typescript
enum CronFrequencyEnum {
  Daily = 'daily',      // 每日
  Weekly = 'weekly'     // 每周
}
```

### CronInputModeEnum

```typescript
enum CronInputModeEnum {
  Manual = 'Manual',    // 手动输入
  Select = 'Select'     // 可视化选择
}
```

### CronWeekDayEnum

```typescript
enum CronWeekDayEnum {
  Sun = 0,              // 周日
  Mon = 1,              // 周一
  Tue = 2,              // 周二
  Wed = 3,              // 周三
  Thu = 4,              // 周四
  Fri = 5,              // 周五
  Sat = 6               // 周六
}
```

## 设计规范

### 输入框样式

- 支持 Ant Design Input 组件的所有样式属性
- 占位符文本: "请输入 Cron 表达式"
- 支持错误状态显示

### 弹出层样式

- 使用 Popover 组件实现
- 内边距: `0`
- 箭头: `false`
- 触发方式: `click`

### 布局结构

- 输入框 + 日历图标
- 点击日历图标打开选择面板
- 支持手动输入和可视化选择两种模式

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中以确保主题正常工作
2. 可视化选择模式会覆盖手动输入的内容
3. 错误信息通过 `onError` 回调返回，需要自行处理显示
4. 组件会自动验证 Cron 表达式的格式
5. 支持键盘快捷键操作（ESC 关闭选择面板）

## 更新日志

- **1.0.0**: 初始版本，支持基础 Cron 表达式输入
- 支持手动输入和可视化选择两种模式
- 集成错误验证和回调机制
- 支持自定义频率类型和输入模式
