/* eslint-disable import/no-anonymous-default-export */
export default {
  pageTitle: '외부 DB 인스턴스 동기화',
  pageDesc:
    '여기에서 외부 DB 인스턴스 플랫폼 구성을 추가할 수 있으며, SQLE는 주기적으로 외부 플랫폼에서 데이터 소스를 동기화합니다.',
  ceTips:
    '사용자가 다른 플랫폼에 데이터 소스를 추가할 때, 이러한 데이터 소스의 SQL 품질을 모니터링하려면 SQLE 플랫폼의 외부 데이터 소스 동기화 기능을 사용하여 외부 플랫폼의 데이터 소스를 SQLE로 동기화할 수 있습니다.\n이를 통해 두 플랫폼에서 데이터 소스를 중복으로 추가하는 것을 방지하고 관리 난이도를 줄일 수 있습니다.',
  syncTaskList: {
    title: '동기화 작업 목록',
    addSyncTask: '동기화 작업 추가',
    syncTaskLoading: '작업 동기화 중...',
    syncTaskSuccessTips: '작업 동기화 성공',
    deleteTaskLoading: '작업 삭제 중...',
    deleteTaskSuccessTips: '작업 삭제 성공',
    columns: {
      name: '동기화 작업 이름',
      source: '소스',
      version: '버전',
      url: '주소',
      instanceType: 'DB 인스턴스 유형',
      lastSyncResult: '마지막 동기화 결과',
      lastSyncSuccessTime: '마지막 성공적인 동기화 시간',
      sync: '동기화',
      deleteConfirmTitle: '현재 동기화 작업을 삭제하시겠습니까?'
    }
  },

  addSyncTask: {
    title: '동기화 작업 추가',
    successTips: '동기화 작업 추가 성공',
    successGuide: '동기화 작업 목록으로 이동하여 추가된 동기화 작업 보기',
    backToList: '동기화 작업 목록으로 돌아가기'
  },
  updateSyncTask: {
    title: '동기화 작업 편집',
    successTips: '동기화 작업 편집 성공',
    getSyncInstanceTaskError: '동기화 작업 데이터 가져오기 실패'
  },
  syncTaskForm: {
    name: '동기화 작업 이름',
    source: '소스',
    url: '주소',
    urlTips: '타사 플랫폼 주소',
    instanceType: 'DB 인스턴스 유형',
    ruleTemplateName: '감사 규칙 템플릿',
    syncInterval: '동기화 간격',
    baseConfig: '기본 구성',
    sqlConfig: 'SQL 감사 구성',
    cronConfig: '사용자 정의 작업 동기화 주기',
    cronTips:
      'Crontab 형식 시간을 수동으로 입력하거나 오른쪽 버튼을 클릭하여 시각적 선택을 활성화합니다',
    helpTips:
      '동기화 작업을 생성하기 전과 후에 사용자는 데이터 소스 플랫폼에서 구성해야 합니다. 자세한 사용 지침은 다음을 참조하세요'
  }
};
