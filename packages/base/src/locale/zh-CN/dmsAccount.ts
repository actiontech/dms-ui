// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '个人中心',
  accountTitle: '账户基本信息',

  emailErrorMessage: {
    type: '请输入正确格式的邮箱地址',
    match: '新邮箱地址不能与旧地址一致'
  },
  phoneErrorMessage: {
    type: '请输入正确格式的手机号码',
    match: '新手机号码不能与旧号码一致'
  },

  modifyPassword: {
    button: '修改密码',
    title: '修改当前用户密码',
    oldPassword: '旧密码',
    newPassword: '新密码',
    newPasswordConfirm: '确认新密码',
    forceChangeTitle: '强制修改密码',
    forceChangeDesc: '为了您的账户安全，请修改您的初始密码',
    passwordExpiryTitle: '密码已过期',
    passwordExpiryDesc: '您的密码已过期，请立即修改密码以继续使用系统',
    passwordExpiryWarning: '您的密码将在 {{days}} 天后过期，建议尽快修改密码',
    passwordExpiryWarningDesc: '建议及时修改密码以确保账户安全',
    passwordExpiryWarningCancel: '稍后提醒',
    success: '密码修改成功',
    error: '更新密码状态失败'
  },

  passwordComplexity: {
    title: '密码复杂度要求',
    lengthError: '密码长度必须在6-32个字符之间',
    lowercaseError: '密码必须包含至少一个小写字母',
    uppercaseError: '密码必须包含至少一个大写字母',
    numberError: '密码必须包含至少一个数字',
    specialCharError: '密码必须包含至少一个特殊字符',
    weakPasswordError: '不能使用常见的弱密码',
    consecutiveCharsError: '密码不能包含3个或以上连续的字符',
    repeatedCharsError: '密码不能包含3个或以上重复的字符',
    strengthWeak: '弱',
    strengthMedium: '中',
    strengthStrong: '强',
    strengthLabel: '密码强度'
  },

  accessToken: {
    label: '访问令牌',
    desc: '您可以在IDE工具上使用访问令牌，进行用户认证',
    expiration: '过期时间',
    hasExpired: '已过期',
    generateToken: {
      buttonText: '生成Token',
      title: '生成访问令牌',
      expiration: '设置访问令牌过期时间（天）',
      generateTips: '新生成的访问令牌将会覆盖旧有的令牌',
      expirationPlaceholder: '过期时间'
    }
  },

  updateEmailSuccess: '邮箱地址更新成功',
  updateWechatSuccess: '微信号更新成功',
  updatePhoneSuccess: '手机号更新成功',
  wechat: '企业微信UserID',
  phone: '手机号',
  sms: {
    title: '双因素认证',
    verificationCode: '验证码',
    noPhoneNumbersTips: '请先完成手机号绑定后开启双因素认证',
    updateSuccessTips: '双因素认证更新成功'
  },

  privacy: {
    controlTitle: '个人信息授权管理',
    controlDescription:
      '管理个人敏感信息的使用授权，包括邮箱、手机号、微信等信息的处理权限',
    authorization: {
      title: '授权确认',
      content:
        '您确定要授权我们处理您的个人信息吗？授权后，您将可以填写个人信息并接收安全事件告警、订阅安全报告等服务。',
      confirm: '同意并开启',
      cancel: '取消'
    },
    revocation: {
      title: '警告：撤回授权',
      content:
        '撤回授权后，已填写的个人信息将被清除且无法修改，您将无法再接收任何安全事件通知。是否确认撤回？',
      confirm: '确认撤回',
      cancel: '取消'
    },
    enableButton: '开启授权',
    revokeButton: '撤回授权',
    statusAuthorized: '已授权个人信息处理',
    statusUnauthorized: '未授权个人信息处理',
    unauthorizedTip: '需要授权后才能编辑个人信息',
    authorizationSuccess: '授权成功',
    revocationSuccess: '授权已撤回'
  }
};
