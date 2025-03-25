// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL 관리 화이트리스트',
  ceTips:
    '사용자는 이제 플랫폼의 SQL 관리 화이트리스트를 사용하여 무시할 SQL 문이나 데이터 소스를 사용자 정의할 수 있으므로 대시보드에 표시되지 않습니다. 예외로 식별되면 SQL 문이 자동으로 SQL 제어 목록에서 제거되어 불필요한 주의를 줄이고 간섭을 최소화하여 제어 효율성과 정확성을 향상시킵니다.',
  allWhitelist: '모든 SQL 관리 화이트리스트',
  table: {
    content: '내용',
    desc: '설명',
    matchType: '일치 유형',
    matchCount: '일치 횟수',
    lastMatchedTime: '마지막 일치 시간'
  },

  matchType: {
    sql: 'SQL 키워드',
    fingerPrint: 'SQL 지문',
    ip: 'IP',
    cidr: '서브넷(CIDR)',
    host: '호스트',
    instance: 'DB 인스턴스 이름'
  },

  operate: {
    add: 'SQL 관리 화이트리스트 추가',
    deleting: 'SQL 관리 화이트리스트 항목 삭제 중...',
    deleteSuccess: 'SQL 관리 화이트리스트 항목이 성공적으로 추가되었습니다',
    confirmDelete: '이 SQL 관리 화이트리스트 항목을 삭제하시겠습니까?'
  },

  modal: {
    add: {
      title: 'SQL 관리 화이트리스트 추가',
      success: 'SQL 관리 화이트리스트가 성공적으로 추가되었습니다'
    },
    update: {
      title: 'SQL 관리 화이트리스트 업데이트',
      success: 'SQL 관리 화이트리스트가 성공적으로 업데이트되었습니다',
      tips: '일치 유형이나 일치 내용이 수정되면 이 레코드의 일치 횟수와 마지막 일치 시간이 재설정됩니다.'
    },
    sql: 'SQL'
  }
};
