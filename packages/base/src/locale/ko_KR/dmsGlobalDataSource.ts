// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '전역 DB 인스턴스',
  ceTips:
    '프로젝트 전반에 걸쳐 DB 인스턴스를 편리하게 관리해야 할 때, 전역 DB 인스턴스 개요 기능을 사용하여 프로젝트에서 인스턴스의 분포와 구성을 효율적으로 이해할 수 있습니다.',

  list: {
    instanceName: 'DB 인스턴스 이름',
    projectName: '프로젝트 이름',
    address: '주소',
    describe: '설명',
    role: '역할',
    type: 'DB 인스턴스 유형',
    ruleTemplate: '템플릿',
    workflow: '워크플로우',
    maintenanceTime: '유지 보수 시간',
    source: '소스',
    business: '비즈니스',
    dataMask: '데이터 마스킹',
    unfinishedWorkflowNum: '미완료 워크플로우 수',
    workbenchQueryAudit: '워크벤치 쿼리 로그'
  },
  testConnectModal: {
    errorTitle: 'DB 인스턴스 {{instanceName}} 연결 테스트 실패'
  },
  deleteDatabase: {
    confirmMessage: 'DB 인스턴스 "{{name}}"을(를) 삭제하시겠습니까?',
    deletingDatabase: 'DB 인스턴스 "{{name}}" 삭제 중...',
    deleteSuccessTips: 'DB 인스턴스 "{{name}}" 삭제 성공'
  },

  addDatabase: 'DB 인스턴스 추가',

  backToList: '전역 DB 인스턴스 목록으로 돌아가기',

  batchImportDataSource: {
    buttonText: 'DB 인스턴스 일괄 가져오기',
    title: 'DB 인스턴스 일괄 가져오기',
    importFile: '가져오기',
    successTitle: 'DB 인스턴스 일괄 가져오기 성공',
    requestAuditErrorMessage:
      '현재 가져온 정보에 유효성 검사 실패가 있습니다. 다운로드된 파일의 프롬프트에 따라 수정하고 다시 가져오세요.',
    submitButton: '가져오기'
  }
};
