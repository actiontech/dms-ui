export const passwordSecurityPolicyMockData = [
  {
    uid: '1234',
    name: 'test1',
    password_expiration_period: 12,
    is_default: false
  },
  {
    uid: '12345',
    name: '中',
    password_expiration_period: 30,
    is_default: true
  },
  {
    uid: '123456',
    name: '低',
    password_expiration_period: 90,
    is_default: true
  },
  {
    uid: '1234567',
    name: '高',
    password_expiration_period: 7,
    is_default: true
  }
];
