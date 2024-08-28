// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'Personal center',
  accountTitle: 'Account basic info',

  emailErrorMessage: {
    type: 'Please enter a valid email address',
    match: 'The new email address cannot be the same as the old one'
  },
  phoneErrorMessage: {
    type: 'Please enter a valid phone number',
    match: 'The new phone number cannot be the same as the old one'
  },

  modifyPassword: {
    button: 'Modify password',
    title: 'Modify current user password',
    oldPassword: 'Old password',
    newPassword: 'New password',
    newPasswordConfirm: 'Confirm new password'
  },

  accessToken: {
    label: 'Access token',
    desc: 'You can use the access token on IDE tools for user authentication',
    expiration: 'Expiration time',
    hasExpired: 'Expired',
    generateToken: {
      buttonText: 'Generate token',
      title: 'Generate access token',
      expiration: 'Set access token expiration time (days)',
      generateTips:
        'The newly generated access token will overwrite the old one',
      expirationPlaceholder: 'Expiration time'
    }
  },

  updateEmailSuccess: 'Email address updated successfully',
  updateWechatSuccess: 'Wechat id updated successfully',
  updatePhoneSuccess: 'Phone number updated successfully',
  wechat: 'Enterprise wechat userid',
  phone: 'Phone number'
};
