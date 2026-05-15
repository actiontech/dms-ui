// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login: 'Login',
  otherMethod: 'Other login methods',

  userAgreementTips: 'Read and agree',
  userAgreement: 'User agreement',

  errorMessage: {
    userAgreement: 'Please read and agree to the user agreement first'
  },

  oauth: {
    title: 'User binding',
    form: {
      username: 'Bound {{title}} username'
    },
    submitButton: 'Bind and login',
    bindTips:
      'If the username does not exist, it will be created automatically',
    errorTitle: 'Oauth login error',
    lostToken: 'Token not found, please return to the login page and try again',
    lostOauth2Token:
      'Oauth token not found, please return to the login page and try again'
  },
  browserVersionTile: 'Browser version incompatible',
  browserVersionDesc:
    'To use the platform features normally, please use Chrome 80 or later'
};
