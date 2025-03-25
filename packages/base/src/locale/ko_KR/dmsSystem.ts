// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '시스템 설정',
  pageDesc: '여기에서 이메일 SMTP 및 기타 시스템 구성을 설정할 수 있습니다',
  testConnection: '연결성 테스트',
  confirmCloseConfigTips: '현재 구성을 닫으시겠습니까?',
  confirmResetConfigTips:
    '구성을 닫으면 현재 편집 정보가 저장되지 않습니다. 구성을 닫으시겠습니까?',
  processConnectionCETips:
    '딩톡, 페이슈 또는 기업용 위챗을 협업 플랫폼으로 사용하고 이러한 외부 플랫폼에서 워크플로우를 승인하려면 통합 기능을 활성화할 수 있습니다. 워크플로우 승인을 팀의 협업 플랫폼에 통합함으로써 승인 프로세스가 더 편리하고 효율적이며 추적 가능해지고, 데이터 보안과 팀 협업 효율성이 향상됩니다.',
  tabPaneTitle: {
    pushNotification: '메시지 푸시',
    processConnection: '통합',
    loginConnection: '로그인 연결',
    globalConfiguration: '전역 구성',
    license: '라이선스',
    personalize: '개인화 설정'
  },

  title: {
    smtp: 'SMTP',
    wechat: '기업용 위챗 구성',
    lark: '페이슈 구성',
    webhook: '웹훅 구성',
    ldap: 'LDAP',
    oauth: 'OAuth2.0 구성',
    larkAudit: '페이슈 감사'
  },

  smtp: {
    enable: '이메일 푸시 활성화',
    host: 'SMTP 주소',
    port: 'SMTP 포트',
    username: 'SMTP 사용자 이름',
    password: 'SMTP 비밀번호',
    passwordConfirm: 'SMTP 비밀번호 확인',
    isSkipVerify: '인증서 인증 건너뛰기?',
    skipVerifyTips:
      '인증서를 건너뛰면 중간자 공격이 발생하고 데이터 무결성을 확인할 수 없을 수 있습니다',

    receiver: '수신자 이메일',
    testing: '"{{email}}"로 테스트 이메일 전송 중...',
    testSuccess: '테스트 이메일이 {{email}}로 성공적으로 전송되었습니다.'
  },

  wechat: {
    enable_wechat_notify: '위챗 알림 활성화',
    corp_id: '기업 ID (위챗 기업 ID)',
    corp_secret: '기업용 위챗 애플리케이션 시크릿',
    agent_id: '기업용 위챗 애플리케이션 ID',
    safe_enabled: '암호화된 전송 활성화',
    proxy_ip: '프록시 서버 IP',

    receiveWechat: '수신자 사용자 ID',
    receiveWechatTips: '기업용 위챗 멤버 계정',
    testing: '{{id}}로 테스트 메시지 전송 중...',
    testSuccess: '테스트 메시지가 성공적으로 전송되었습니다'
  },

  lark: {
    enable: '페이슈 푸시 활성화',
    testing: '페이슈로 메시지 푸시 중...',
    testSuccess: '메시지가 지정된 계정으로 성공적으로 푸시되었습니다',
    receiveType: '수신 방법 선택',
    email: '이메일',
    phone: '휴대폰 번호'
  },

  webhook: {
    enableWebhookNotify: '웹훅 알림 활성화',
    maxRetryTimes: '최대 재시도 횟수',
    retryIntervalSeconds: '최대 재시도 간격 (초)',
    testing: '{{url}}로 테스트 메시지 푸시 중...',
    testSuccess: '테스트 메시지가 성공적으로 전송되었습니다',
    configDocs: '웹훅 구성 문서'
  },

  ldap: {
    enableLdap: 'LDAP 서비스 활성화',
    enableLdapSSL: 'SSL 활성화',
    ldapServerHost: 'LDAP 서버 주소',
    ldapServerPort: 'LDAP 서버 포트',
    ldapConnectDn: '연결 사용자 DN',
    ldapConnectDnTips:
      'LDAP에 로그인하여 이 사용자를 사용하여 로그인 인터페이스 로그인 사용자 정보를 쿼리합니다',
    ldapConnectPwd: '연결 사용자 비밀번호',
    ldapSearchBaseDn: '쿼리 루트 DN',
    ldapSearchBaseDnTips:
      '쿼리 루트 DN, 설명: 쿼리는 이 디렉토리를 루트 디렉토리로 사용합니다',
    ldapUserNameRdnKey: '사용자 이름 속성 이름',
    ldapUserNameRdnKeyTips:
      'LDAP에서 SQLE에 바인딩된 사용자 이름에 해당하는 속성 이름',
    ldapUserEmailRdnKey: '사용자 이메일 속성 이름',
    ldapUserEmailRdnKeyTips:
      'LDAP에서 SQLE에 바인딩된 사용자 이메일에 해당하는 속성 이름'
  },

  oauth: {
    ceTips:
      '사용자가 회사 내에서 이미 일반적인 계정과 비밀번호 세트를 가지고 있고 이 세트의 일반 계정과 비밀번호를 사용하여 SQLE에 로그인하려는 경우, 사용자는 플랫폼의 OAuth2.0 연결 기능을 사용할 수 있습니다. OAuth2.0을 올바르게 활성화하고 구성한 후, 사용자는 SQLE 로그인 인터페이스에서 타사 로그인을 사용할 수 있습니다.\n따라서 사용자는 일반 계정과 비밀번호를 사용하여 로그인할 수 있으며, 다른 SQLE 비밀번호 세트를 기억할 필요가 없어 기업 사용자의 효율성을 향상시킬 수 있습니다.',
    featureName: '사용자 연결 OAuth2.0',

    enable: 'OAuth2.0 로그인 활성화',
    clientId: '애플리케이션 ID',
    clientIdTips:
      '애플리케이션의 고유 식별자입니다. 연결할 플랫폼에서 신청하세요. OAuth2.0 인증 프로세스에서 appid의 값은 oauth_consumer_key의 값과 동일합니다.',

    clientSecret: '애플리케이션 시크릿',
    clientSecretTips:
      'appid에 해당하는 시크릿으로, 사용자 리소스에 접근할 때 애플리케이션의 합법성을 확인하는 데 사용됩니다. OAuth2.0 인증 프로세스에서 appkey의 값은 oauth_consumer_secret의 값과 동일합니다. 이 항목이 이전에 구성된 경우, 업데이트할 때 이 항목을 채우지 않으면 시크릿을 업데이트하지 않는다는 의미입니다.',
    clientHost: 'SQLE의 외부 접근 주소',
    clientHostTips: '형식은 http(s)://ip:port입니다',

    serverAuthUrl: 'OAuth2.0 로그인 인증 페이지 주소',
    serverAuthUrlTips: 'http(s)://ip:port/xxx와 유사한 형식',

    serverTokenUrl: 'OAuth2.0 access_token 획득 주소',
    serverTokenUrlTips: 'http(s)://ip:port/xxx와 유사한 형식',

    serverUserIdUrl: 'OAuth2.0 사용자 ID 획득 주소',
    serverUserIdUrlTips: 'http(s)://ip:port/xxx와 유사한 형식',

    scopes: '요청 리소스 범위',
    scopesTips:
      '이 범위는 확인 서버에 의해 정의되며, 여러 범위는 쉼표로 구분됩니다',

    accessTokenKeyName: 'Access_token 키 이름',
    accessTokenKeyNameTips:
      'SQLE는 사용자 ID를 얻을 때 이 키에 해당하는 값에 access_token을 넣습니다. 이 매개변수는 사용자 ID 획득 주소에 GET 요청의 매개변수로 전송됩니다',

    userIdKeyName: '사용자 UID의 JSON 경로',
    userIdKeyNameTips:
      'SQLE는 이 경로를 사용하여 타사 플랫폼에서 사용자 정보를 얻는 응답에서 사용자 ID를 파싱합니다. 사용자 ID는 고유 ID여야 합니다',
    userEmailTagName: '사용자 이메일의 JSON 경로',
    userEmailTagNameTips:
      'SQLE는 이 경로를 사용하여 타사 플랫폼에서 사용자 정보를 얻는 응답에서 사용자 이메일을 파싱합니다',
    userWechatTagName: '사용자 위챗 ID의 JSON 경로',
    userWechatTagNameTips:
      'SQLE는 이 경로를 사용하여 타사 플랫폼에서 사용자 정보를 얻는 응답에서 사용자 위챗 ID를 파싱합니다',

    loginButtonText: '로그인 버튼 텍스트',
    loginButtonTextTips: '로그인 페이지 OAuth2.0 로그인 버튼 텍스트',
    loginButtonTextValidateMessage: '최대 28자',

    autoCreateUser: '자동으로 사용자 생성 및 바인딩',
    autoCreateUserTips:
      '활성화된 경우, OAuth2를 통해 로그인할 때 사용자가 SQLE 사용자에 바인딩되어 있지 않으면 SQLE는 OAuth2 서버에서 얻은 사용자 ID를 기반으로 SQLE 계정을 생성하고, 바인딩 인터페이스로 이동하지 않고 SQLE 메인 인터페이스로 들어갑니다.',
    skipCheckState: '요청 소스 확인 건너뛰기',
    skipStateCheckTips:
      '요청 전송 소스의 확인을 건너뛰면 계정이 위험에 노출될 수 있습니다. 신뢰할 수 있는 환경에서만 이 옵션을 활성화하는 것이 좋습니다. 활성화 후, SQLE는 콜백에서 state 매개변수를 더 이상 확인하지 않습니다.'
  },

  dingTalk: {
    titleTips:
      '승인 정보는 감사자의 휴대폰 번호에 따라 해당 딩톡 계정으로 전송됩니다',
    enable: '딩톡 감사 활성화',
    test: '테스트',
    testSuccess: '현재 appkey와 appsecret이 확인되었습니다'
  },

  larkAudit: {
    enable: '페이슈 감사 활성화',
    test: '테스트',
    titleTips:
      '승인 정보는 감사자의 휴대폰 번호에 따라 해당 페이슈 계정으로 전송됩니다',
    testSuccess: '메시지가 지정된 계정으로 성공적으로 푸시되었습니다',
    testing: '페이슈로 메시지 푸시 중...',
    receiveType: '수신 방법',
    email: '이메일',
    phone: '휴대폰 번호',
    ceTips:
      '페이슈를 협업 플랫폼으로 사용하고 페이슈에서 작업 워크플로우를 승인하려면 페이슈 감사 기능을 활성화할 수 있습니다. 작업 워크플로우 승인을 팀의 협업 플랫폼에 통합함으로써 승인 프로세스가 더 편리하고 효율적이며 추적 가능해지고, 데이터 보안과 팀 협업 효율성이 향상됩니다.'
  },

  wechatAudit: {
    titleTips:
      '승인 정보는 감사자의 위챗 기업 ID에 따라 해당 계정으로 전송됩니다',
    enable: '기업용 위챗 감사 활성화',
    test: '테스트',
    testing: '기업용 위챗 사용자에게 메시지 푸시 중...',
    testSuccess: '메시지가 지정된 계정으로 성공적으로 푸시되었습니다',
    corpID: '기업 ID (위챗 기업 ID)',
    corpSecret: '기업용 위챗 애플리케이션 시크릿',
    wechatUserID: '기업용 위챗 사용자 ID'
  },

  license: {
    productName: '데이터 제어 플랫폼 1.0',
    table: {
      name: '이름',
      limit: '제한'
    },

    form: {
      licenseFile: '라이선스 파일'
    },

    collect: '라이선스 정보 수집',
    import: '라이선스 정보 가져오기',
    importSuccessTips: '라이선스 가져오기 성공'
  },

  global: {
    workflowExpiredHours: '완료된 작업 워크플로우의 자동 만료 시간',
    operationRecordExpiredHours: '작업 기록 만료 시간',
    cbOperationLogsExpiredHours: 'CB 워크스테이션 작업 감사 만료 시간',
    urlAddressPrefix: 'URL 주소 접두사',
    urlAddressPrefixTips: 'SQLE에 접근할 수 있는 URL 주소 정보 구성',
    urlAddressFormatTips: '형식은 http(s)://ip:port/sqle입니다'
  },

  personalize: {
    title: '개인화된 제목',
    match: '새 제목은 기존 제목과 같을 수 없습니다',
    updateTitleSuccessTips: '개인화된 제목 업데이트 성공',

    logo: '개인화된 로고',
    uploadAndUpdate: '업로드 및 업데이트',
    uploadTips: '권장 크기는 58 × 48 png 이미지입니다',
    limitSize: '이미지 크기는 5MB를 초과할 수 없습니다'
  },

  version: {
    gotIt: '알겠습니다',
    versionInfo: '버전 정보',
    productIntroduction: '제품 소개',
    productFeatures: '기능',
    sqle_desc:
      'SQLE는 아이시노에서 개발한 여러 데이터베이스를 지원하는 독립적으로 개발된 SQL 품질 관리 플랫폼입니다. 개발, 테스트, 출시 및 생산 운영 단계에서 SQL 품질 거버넌스에 사용됩니다. "표준 수립, 사전 제어, 사후 감독 및 표준 출시" 방법을 통해 기업에 SQL 품질을 전체 수명 주기 동안 제어할 수 있는 능력을 제공하면서 내부 개발 표준의 신속한 구현을 촉진합니다.',
    sqle_feature:
      '1. 메인스트림 상용 및 오픈 소스 데이터베이스의 사용 시나리오를 충족하며, 10개 이상의 데이터 소스 유형을 지원합니다.\n2. 운영 및 유지보수 전문가 팀의 수년간의 기술적 축적을 제공하고 규칙 지식 베이스의 독립적인 축적을 지원합니다.\n3. 느린 로그를 포함한 10개 이상의 유형의 SQL 지능형 스캐닝을 제공하여 SQL 수집의 사전 및 사후 요구 사항을 충족합니다.\n4. SQL의 전체 프로세스 제어 관점을 제공하고, 문제가 있는 SQL 해결 진행 상황을 추적하며, 빠른 최적화를 제공합니다.'
  },
  notification: {
    title: '시스템 공지',
    hasDirtyDataTips: '현재 내용이 변경되었습니다. 수정을 취소하시겠습니까?',
    successMessage: '시스템 공지가 성공적으로 게시되었습니다!',
    notData: '공지 정보 없음'
  }
};
