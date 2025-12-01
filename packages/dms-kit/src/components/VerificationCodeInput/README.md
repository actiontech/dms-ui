---
group:
  title: 业务组件
  order: 1
---

# VerificationCodeInput 验证码输入

集成验证码发送、倒计时功能的输入组件，基于 BasicInput 和 BasicButton 封装。

## 何时使用

- 用户注册/登录需要验证码验证
- 密码重置需要验证码确认
- 敏感操作需要二次验证

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 表单集成

<code src="./demo/customSendLogic.tsx"></code>

## API

VerificationCodeInput 基于 BasicInput 和 BasicButton 封装，继承 Ant Design Input 的所有属性。

### 扩展属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| onSendCode | 发送验证码的回调函数 | `() => Promise<AxiosResponse>` | - | ✅ |
| interval | 倒计时间隔（秒） | `number` | `60` | - |

### 常用 Input 属性

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| placeholder | 输入框提示文字 | `string` | `请输入验证码` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |

## 组件特点

1. **统一样式规范** → 自动应用项目主题系统的样式
2. **自动倒计时** → 发送验证码后自动开始倒计时，倒计时期间按钮禁用
3. **状态管理** → 自动处理 loading 状态和按钮禁用状态
4. **灵活配置** → 支持自定义倒计时间隔，适应不同业务场景
5. **表单集成** → 完全兼容 Ant Design Form 组件

## 注意事项

1. 组件需要包裹在 `ConfigProvider` 中确保主题正常工作
2. `onSendCode` 是必填属性，必须返回 Promise
3. 发送失败时需要在 `onSendCode` 中抛出错误，组件会停止倒计时
4. 支持中英文国际化，自动根据系统语言切换

## 最佳实践

1. **前置验证**：在 `onSendCode` 中验证手机号/邮箱格式，避免无效请求
2. **错误处理**：添加完整的错误处理逻辑，提供清晰的用户提示
3. **安全限制**：根据场景选择合适的倒计时间隔（60-120 秒）
4. **表单验证**：结合 Form 使用时添加验证码长度和格式验证
