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
    newPasswordConfirm: '确认新密码'
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

  loginConfiguration: {
    title: '登录设置'
  }
};
