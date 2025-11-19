---
group:
  title: 业务工具组件
  order: 14
---

# TestDatabaseConnectButton 数据库连接测试按钮

数据库连接测试按钮组件，集成测试按钮、加载状态和结果反馈，提供完整的数据库连接测试流程。

## 何时使用

- 数据库配置页面，需要验证连接参数
- 表单中需要测试数据库连接
- 需要显示连接测试结果和失败原因

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

## API

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| onClickTestButton | 测试按钮点击回调 | `() => void` | - | ✅ |
| loading | 是否处于测试加载状态 | `boolean` | - | ✅ |
| connectAble | 数据库是否可连接 | `boolean` | - | ✅ |
| connectDisableReason | 连接失败的原因 | `string` | - | - |
| initHide | 是否初始隐藏测试结果 | `boolean` | `true` | - |

## 组件特点

组件自动管理完整测试流程：

1. **初始状态** → 显示测试按钮
2. **测试中** → 按钮 loading + "测试中..."提示
3. **测试成功** → 绿色成功提示
4. **测试失败** → 红色失败提示 + 失败原因

## 注意事项

1. 必须在 `ConfigProvider` 中使用
2. `onClickTestButton` 需要处理实际的测试逻辑（如 API 调用）
3. 父组件负责管理 `loading`、`connectAble`、`connectDisableReason` 状态
4. `connectDisableReason` 仅在 `connectAble` 为 `false` 时显示
5. 建议控制测试频率，避免频繁请求

## 最佳实践

1. **状态管理**：在父组件统一管理测试状态
2. **错误处理**：提供清晰的错误原因，帮助用户排查问题
3. **用户反馈**：配合 `message` 组件提供即时反馈
4. **防抖控制**：避免用户频繁点击测试按钮
