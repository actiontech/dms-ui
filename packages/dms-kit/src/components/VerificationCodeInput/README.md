---
group:
  title: 业务组件
  order: 1
---

# VerificationCodeInput 验证码输入

基于 BasicInput 和 BasicButton 组件封装的验证码输入组件，集成了发送验证码、倒计时等功能，适用于用户注册、登录、密码重置等需要验证码的场景。

## 何时使用

- 用户注册时需要发送邮箱/手机验证码
- 用户登录时需要验证码验证
- 密码重置时需要验证码确认
- 其他需要验证码验证的业务场景

## 代码演示

### 基础用法

<code src="./demo/basic.tsx"></code>

### 自定义倒计时间隔

<code src="./demo/customInterval.tsx"></code>

### 自定义发送逻辑

<code src="./demo/customSendLogic.tsx"></code>


## API

### VerificationCodeInput

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onSendCode | 发送验证码的回调函数 | `() => Promise<AxiosResponse<unknown, any>>` | - | - |
| interval | 倒计时间隔（秒） | `number` | `60` | - |

### 继承属性

VerificationCodeInput 组件继承了 Ant Design Input 组件的所有属性，包括但不限于：

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| placeholder | 输入框提示文字 | `string` | `请输入验证码` | - |
| disabled | 是否禁用 | `boolean` | `false` | - |
| size | 输入框大小 | `'large' \| 'middle' \| 'small'` | `'middle'` | - |
| className | 输入框类名 | `string` | - | - |
| style | 输入框样式 | `CSSProperties` | - | - |
| onChange | 输入内容变化时的回调 | `(e: ChangeEvent<HTMLInputElement>) => void` | - | - |
| onPressEnter | 按下回车键时的回调 | `(e: KeyboardEvent<HTMLInputElement>) => void` | - | - |

## 设计规范

### 布局规范

- **输入框**: 占据主要空间，支持输入验证码
- **发送按钮**: 右侧固定宽度，包含发送状态和倒计时
- **整体布局**: 使用 Space 组件实现水平布局，输入框自适应宽度

### 交互规范

- **发送状态**: 点击发送按钮后显示 loading 状态
- **倒计时**: 发送成功后开始倒计时，倒计时期间按钮禁用
- **重试机制**: 倒计时结束后可重新发送验证码

### 样式特性

- 响应式布局，输入框自适应容器宽度
- 统一的按钮样式和状态管理
- 支持主题系统配置
- 良好的无障碍访问支持

### 主题配置

组件样式通过主题系统进行配置，支持以下主题变量：

```typescript
theme.sharedTheme.components.verificationCodeInput = {
  input: {
    default: { border, borderRadius, padding },
    focus: { borderColor, boxShadow },
    disabled: { background, color }
  },
  button: {
    default: { background, color, border },
    hover: { background, color },
    disabled: { background, color, cursor }
  }
}
```

## 注意事项

1. **必需的回调函数**: `onSendCode` 属性是必需的，用于处理验证码发送逻辑
2. **异步处理**: `onSendCode` 必须返回 Promise，组件会自动处理 loading 状态
3. **倒计时管理**: 组件内部使用 `useCountDown` hook 管理倒计时状态
4. **国际化支持**: 组件支持中英文国际化，通过 `useTranslation` hook 实现
5. **错误处理**: 建议在 `onSendCode` 回调中添加适当的错误处理逻辑
6. **表单验证**: 可以结合 Form 组件使用，支持表单验证规则

## 最佳实践

### 发送验证码逻辑

```typescript
const handleSendCode = async () => {
  try {
    // 验证手机号/邮箱格式
    if (!isValidPhone(phone)) {
      message.error('请输入正确的手机号');
      return;
    }
    
    // 调用发送验证码 API
    const response = await sendVerificationCode(phone);
    
    if (response.success) {
      message.success('验证码已发送');
    } else {
      message.error(response.message || '发送失败');
    }
  } catch (error) {
    message.error('发送失败，请重试');
  }
};
```

### 表单集成

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

## 更新日志

- **1.0.0**: 初始版本
  - 基于 BasicInput 和 BasicButton 组件封装
  - 集成验证码发送和倒计时功能
  - 支持自定义倒计时间隔
  - 完整的国际化支持
  - 响应式布局设计
