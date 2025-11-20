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
- 其他需要验证码的业务场景

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 表单集成

<code src="./demo/customSendLogic.tsx"></code>

## API

### VerificationCodeInput

| 参数 | 说明 | 类型 | 默认值 | 必填 |
| --- | --- | --- | --- | --- |
| onSendCode | 发送验证码的回调函数 | `() => Promise<AxiosResponse>` | - | ✅ |
| interval | 倒计时间隔（秒） | `number` | `60` | - |
| placeholder | 输入框提示文字 | `string` | `请输入验证码` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |

继承 Ant Design Input 的所有其他属性，详见 [Input API](https://ant.design/components/input-cn#api)

## 组件特点

1. **自动倒计时** → 发送验证码后自动开始倒计时，倒计时期间按钮禁用
2. **状态管理** → 自动处理 loading 状态和按钮禁用状态
3. **灵活配置** → 支持自定义倒计时间隔，适应不同业务场景
4. **表单集成** → 完全兼容 Ant Design Form 组件
5. **国际化支持** → 内置中英文国际化

## 核心功能详解

### 发送验证码

通过 `onSendCode` 回调函数处理验证码发送逻辑：

```typescript
const handleSendCode = async () => {
  // 调用发送验证码 API
  const response = await sendVerificationCode(phone);
  message.success('验证码已发送');
  return response;
};

<VerificationCodeInput onSendCode={handleSendCode} />
```

**注意**：
- `onSendCode` 必须返回 Promise
- 组件会自动处理 loading 状态
- 发送成功后自动开始倒计时

### 自定义倒计时间隔

根据业务场景选择合适的倒计时间隔：

```typescript
// 30 秒 - 适用于测试环境或安全要求不高的场景
<VerificationCodeInput onSendCode={handleSendCode} interval={30} />

// 60 秒（默认）- 适用于大多数生产环境
<VerificationCodeInput onSendCode={handleSendCode} />

// 120 秒 - 适用于安全要求较高的场景（如支付验证）
<VerificationCodeInput onSendCode={handleSendCode} interval={120} />
```

### 表单集成

与 Ant Design Form 无缝集成：

```typescript
<Form.Item
  name="verificationCode"
  label="验证码"
  rules={[
    { required: true, message: '请输入验证码' },
    { len: 6, message: '验证码长度为6位' }
  ]}
>
  <VerificationCodeInput
    onSendCode={handleSendCode}
    placeholder="请输入6位验证码"
  />
</Form.Item>
```

### 发送前验证

在发送验证码前进行业务验证：

```typescript
const handleSendCode = async () => {
  // 验证手机号是否已输入
  if (!phone) {
    message.error('请先输入手机号');
    throw new Error('手机号为空');
  }

  // 验证手机号格式
  if (!isValidPhone(phone)) {
    message.error('请输入正确的手机号格式');
    throw new Error('手机号格式错误');
  }

  // 发送验证码
  const response = await sendVerificationCode(phone);
  message.success('验证码已发送');
  return response;
};
```

## 注意事项

1. `onSendCode` 是必填属性，必须返回 Promise
2. 组件使用 `useCountDown` hook 管理倒计时状态
3. 发送失败时需要在 `onSendCode` 中抛出错误，组件会停止倒计时
4. 支持中英文国际化，自动根据系统语言切换
5. 组件需要包裹在 `ConfigProvider` 中使用

## 最佳实践

1. **前置验证**：在 `onSendCode` 中验证手机号/邮箱格式，避免无效请求
2. **错误处理**：添加完整的错误处理逻辑，提供清晰的用户提示
3. **安全限制**：根据场景选择合适的倒计时间隔（60-120 秒）
4. **表单验证**：结合 Form 使用时添加验证码长度和格式验证
5. **用户反馈**：使用 message 提示发送成功或失败，提升用户体验
