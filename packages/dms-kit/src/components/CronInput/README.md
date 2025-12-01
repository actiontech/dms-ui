---
group:
  title: 工具
  order: 2
---

# CronInput Cron 表达式输入

Cron 表达式输入组件，支持手动输入和可视化选择两种模式。

## 何时使用

- 需要配置定时任务的 Cron 表达式
- 需要用户友好的 Cron 表达式输入界面
- 任务调度、定时备份等场景
- 需要验证 Cron 表达式格式

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义配置

<code src="./demo/customFrequency.tsx"></code>

## API

### CronInput

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| value | Cron 表达式的值 | `string` | - | - |
| onChange | 值变化回调 | `(value: string) => void` | - | - |
| defaultFrequency | 默认频率类型 | `'daily' \| 'weekly'` | - | - |
| inputMode | 输入模式 | `'Manual' \| 'Select'` | `'Manual'` | - |
| onModeChange | 模式变化回调 | `(mode: string) => void` | - | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| onError | 错误信息回调 | `(errorMessage: string) => void` | - | - |

### 类型说明

**频率类型（defaultFrequency）**
- `'daily'`：每日
- `'weekly'`：每周

**输入模式（inputMode）**
- `'Manual'`：手动输入
- `'Select'`：可视化选择

**星期枚举（用于每周频率）**
- `0`：周日
- `1`：周一
- `2`：周二
- `3`：周三
- `4`：周四
- `5`：周五
- `6`：周六

## 组件特点

1. **双模式输入** → 支持手动输入和可视化选择两种模式
2. **自动验证** → 自动验证 Cron 表达式格式，错误回调
3. **频率预设** → 支持每日、每周两种频率类型
4. **友好交互** → 日历图标触发，支持 ESC 快捷键关闭

## 输入模式

- **手动输入（Manual）**：直接输入 Cron 表达式，适合熟悉 Cron 语法的用户
- **可视化选择（Select）**：通过时间选择器配置，适合不熟悉 Cron 语法的用户
- **模式切换**：可视化选择会覆盖手动输入的内容

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. 可视化选择模式会覆盖手动输入的内容
3. 错误信息通过 `onError` 回调返回，需自行处理显示
4. 支持 ESC 快捷键关闭选择面板

## 最佳实践

1. **默认模式**：不熟悉 Cron 语法的场景建议使用可视化选择模式
2. **错误处理**：配合 Form.Item 的 `validateStatus` 和 `help` 显示错误信息
3. **频率选择**：根据业务场景预设 `defaultFrequency`，减少用户操作
4. **禁用状态**：查看模式下使用 `disabled` 属性防止误操作
