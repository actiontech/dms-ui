// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'DB 인스턴스',
  pageDesc:
    'SQL 감사가 필요한 DB 인스턴스를 여기에 등록하고, DB 인스턴스에 대해 다양한 기능을 활성화할지 여부를 선택할 수 있습니다.',

  databaseListTitle: 'DB 인스턴스 목록',

  databaseList: {
    instanceName: 'DB 인스턴스 이름',
    address: '주소',
    describe: '설명',
    role: '역할',
    type: 'DB 인스턴스 유형',
    enabledScanTypes: '활성화된 스캔 유형',
    ruleTemplate: '템플릿',
    workflow: '워크플로우',
    maintenanceTime: '유지 보수 시간',
    source: '소스',
    business: '비즈니스',
    dataMask: '데이터 마스킹'
  },

  backDesc: 'DB 인스턴스 목록으로 돌아가기',
  addDatabase: 'DB 인스턴스 추가',
  addDatabaseSuccess: 'DB 인스턴스 추가 성공',
  addDatabaseSuccessGuide:
    'DB 인스턴스 목록으로 이동하여 새로 추가된 DB 인스턴스 보기',

  updateDatabase: {
    title: 'DB 인스턴스 편집',
    getDatabaseInfoError: 'DB 인스턴스 정보 가져오기 실패',
    updateDatabase: 'DB 인스턴스 업데이트',
    updateDatabaseSuccess: 'DB 인스턴스 "{{name}}" 업데이트 성공'
  },

  dataSourceForm: {
    baseConfig: '기본 구성',
    sqlConfig: 'SQL 감사 구성',
    name: 'DB 인스턴스 이름',
    describe: 'DB 인스턴스 설명',
    type: 'DB 인스턴스 유형',
    ip: 'DB 인스턴스 주소',
    ipTips: 'DB 인스턴스 IP 또는 도메인 이름',
    port: 'DB 인스턴스 포트',
    user: '연결 사용자',
    password: '비밀번호',
    role: '접근 가능한 역할',
    project: '프로젝트',
    business: '비즈니스',
    ruleTemplate: '감사 규칙 템플릿',
    workflow: '적용된 워크플로우',
    maxPreQueryRows: 'SQL 쿼리 반환 행',
    queryTimeoutSecond: 'SQL 타임아웃 제한(초)',
    maintenanceTime: '유지 보수 시간',
    maintenanceTimeTips:
      '유지 보수 시간을 설정한 후에는 이 유지 보수 시간 동안에만 워크플로우를 실행할 수 있습니다',
    needAuditSqlService: 'SQL 감사 서비스 활성화',
    closeAuditSqlServiceTips:
      'SQL 감사 서비스를 활성화하지 않으면 DB 인스턴스를 SQL 감사 관련 서비스에서 사용할 수 없습니다. 닫으시겠습니까?',
    needAuditForSqlQuery: 'SQL 쿼리 감사 필요 여부',
    allowQueryWhenLessThanAuditLevel: '쿼리 실행을 위한 최고 감사 수준',
    passwordTips:
      '구성한 현재 DB 인스턴스 비밀번호는 여기에 표시되지 않습니다. 제출 시 비밀번호를 입력하지 않으면 DB 인스턴스 비밀번호가 변경되지 않습니다.',
    needUpdatePassword: '비밀번호 업데이트',
    updatePassword: '연결 비밀번호 업데이트',
    dataMaskConfig: '데이터 마스킹 구성',
    dataMaskConfigLabel: 'SQL 워크벤치에 대한 데이터 마스킹 구성 활성화 여부',
    dataMaskConfigTips: '활성화 후, SQL 워크벤치의 쿼리 결과가 마스킹됩니다',
    checkDataMaskButton: '데이터 마스킹 규칙 보기'
  },

  testConnectModal: {
    errorTitle: 'DB 인스턴스 {{instanceName}} 연결 테스트 실패'
  },

  deleteDatabase: {
    confirmMessage: 'DB 인스턴스 "{{name}}"을(를) 삭제하시겠습니까?',
    deletingDatabase: 'DB 인스턴스 "{{name}}" 삭제 중...',
    deleteSuccessTips: 'DB 인스턴스 "{{name}}" 삭제 성공'
  },

  enabledAuditPlan: {
    text: 'DB 인스턴스에 대한 스캔 작업 활성화'
  },

  batchImportDataSource: {
    buttonText: 'DB 인스턴스 일괄 가져오기',
    title: 'DB 인스턴스 일괄 가져오기',
    importFile: '가져오기',
    successTitle: 'DB 인스턴스 일괄 가져오기 성공',
    requestAuditErrorMessage:
      '현재 가져온 정보에 유효성 검사 실패가 있습니다. 다운로드된 파일의 프롬프트에 따라 수정하고 다시 가져오세요'
  }
};
