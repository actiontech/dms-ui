// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '개인 센터',
  accountTitle: '계정 기본 정보',

  emailErrorMessage: {
    type: '유효한 이메일 주소를 입력해 주세요',
    match: '새 이메일 주소는 기존 이메일과 동일할 수 없습니다'
  },
  phoneErrorMessage: {
    type: '유효한 전화번호를 입력해 주세요',
    match: '새 전화번호는 기존 전화번호와 동일할 수 없습니다'
  },

  modifyPassword: {
    button: '비밀번호 수정',
    title: '현재 사용자 비밀번호 수정',
    oldPassword: '기존 비밀번호',
    newPassword: '새 비밀번호',
    newPasswordConfirm: '새 비밀번호 확인'
  },

  accessToken: {
    label: '접근 토큰',
    desc: 'IDE 도구에서 사용자 인증을 위해 접근 토큰을 사용할 수 있습니다',
    expiration: '만료 시간',
    hasExpired: '만료됨',
    generateToken: {
      buttonText: '토큰 생성',
      title: '접근 토큰 생성',
      expiration: '접근 토큰 만료 시간 설정 (일)',
      generateTips: '새로 생성된 접근 토큰은 기존 토큰을 덮어씁니다',
      expirationPlaceholder: '만료 시간'
    }
  },

  updateEmailSuccess: '이메일 주소가 성공적으로 업데이트되었습니다',
  updateWechatSuccess: '위챗 ID가 성공적으로 업데이트되었습니다',
  updatePhoneSuccess: '전화번호가 성공적으로 업데이트되었습니다',
  wechat: '기업용 위챗 사용자 ID',
  phone: '전화번호'
};
