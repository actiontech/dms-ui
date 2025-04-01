// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '감사 화이트리스트',
  pageDesc:
    '감사 중에 어떤 감사 규칙도 트리거하지 않을 일부 SQL 문을 여기에 추가할 수 있습니다.',

  ceTips:
    '사용자가 규칙을 활성화했지만 실제 사용 시 특정 규칙의 트리거를 일시적으로 우회하려는 경우, 플랫폼의 감사 화이트리스트 기능을 활성화할 수 있습니다.\n현재 문자열 일치 또는 SQL 지문 일치를 지원합니다. SQL 감사 화이트리스트에 추가된 문은 워크플로우 요청을 생성할 때 감사 규칙의 적용을 받지 않습니다.',
  allWhitelist: '모든 감사 화이트리스트 문',
  table: {
    sql: 'SQL 문',
    desc: '감사 화이트리스트 설명',
    matchType: '일치 모드',
    matchCount: '일치 횟수',
    lastMatchedTime: '마지막 일치 시간'
  },

  matchType: {
    exact: '문자열 일치',
    fingerPrint: 'SQL 지문 일치'
  },

  operate: {
    addWhitelist: '감사 화이트리스트 추가',

    deleting: '감사 화이트리스트 항목 삭제 중...',
    deleteSuccess: '감사 화이트리스트 항목이 성공적으로 삭제되었습니다',
    confirmDelete: '이 감사 화이트리스트 항목을 삭제하시겠습니까?'
  },

  modal: {
    add: {
      title: '감사 화이트리스트 추가',
      success: '감사 화이트리스트가 성공적으로 추가되었습니다'
    },
    update: {
      title: '감사 화이트리스트 업데이트',
      success: '감사 화이트리스트가 성공적으로 업데이트되었습니다',
      tips: '일치 유형이나 일치 내용이 수정되면 이 레코드의 일치 횟수와 마지막 일치 시간이 재설정됩니다.'
    },
    sql: 'SQL'
  }
};
