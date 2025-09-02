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
    newPasswordConfirm: 'Confirm new password',
    forceChangeTitle: 'Force password change',
    forceChangeDesc:
      'For the security of your account, please change your initial password',
    passwordExpiryTitle: 'Password expired',
    passwordExpiryDesc:
      'Your password has expired, please change it immediately to continue using the system',
    passwordExpiryWarning:
      'Your password will expire in {{days}} days, please change it as soon as possible'
  },

  passwordComplexity: {
    title: 'Password complexity requirements',
    lengthError: 'Password length must be between 8-32 characters',
    lowercaseError: 'Password must contain at least one lowercase letter',
    uppercaseError: 'Password must contain at least one uppercase letter',
    numberError: 'Password must contain at least one number',
    specialCharError: 'Password must contain at least one special character',
    weakPasswordError: 'Cannot use common weak passwords',
    consecutiveCharsError:
      'Password cannot contain 3 or more consecutive characters',
    repeatedCharsError: 'Password cannot contain 3 or more repeated characters',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    strengthLabel: 'Password strength'
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
  phone: 'Phone number',
  sms: {
    title: 'Two-factor authentication',
    verificationCode: 'Verification code',
    noPhoneNumbersTips:
      'Please bind your phone number first to enable two-factor authentication',
    updateSuccessTips: 'Two-factor authentication updated successfully'
  },

  privacy: {
    controlTitle: 'Personal information authorization management',
    controlDescription:
      'Manage the authorization for processing personal sensitive information, including email, phone number, WeChat and other information processing permissions',
    authorization: {
      title: 'Authorization confirmation',
      content:
        'Are you sure you want to authorize us to process your personal information? After authorization, you will be able to fill in personal information and receive security event alerts, subscribe to security reports and other services.',
      confirm: 'Agree and enable',
      cancel: 'Cancel'
    },
    revocation: {
      title: 'Warning: Revoke authorization',
      content:
        'After revoking authorization, the filled personal information will be cleared and cannot be modified, and you will no longer receive any security event notifications. Are you sure to revoke?',
      confirm: 'Confirm revocation',
      cancel: 'Cancel'
    },
    enableButton: 'Enable authorization',
    revokeButton: 'Revoke authorization',
    statusAuthorized: 'Personal information processing authorized',
    statusUnauthorized: 'Personal information processing not authorized',
    unauthorizedTip: 'Authorization required to edit personal information',
    authorizationSuccess: 'Authorization successful',
    revocationSuccess: 'Authorization revoked'
  }
};
