// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'IDE 감사',
  ceTips:
    '개발 중에 독립적으로 SQL 품질을 확인해야 할 때, SQLE에서 제공하는 IDE 감사 플러그인을 구성할 수 있습니다. 또한 IDE에서 감사된 SQL을 검토해야 할 때, SQLE에서 제공하는 기록 기능을 사용하여 사용량 및 관련 통계를 볼 수 있습니다.',
  promptTitle: '아직 생성된 감사 기록 없음',
  promptDesc:
    'IDE 감사 기록을 확인하여 IDE에서 감사된 SQL을 검토하고 관련 통계를 얻을 수 있습니다',
  promptStep:
    'IDE 감사를 사용하여 감사 결과 얻기\n플랫폼이 실시간으로 사용 기록 생성',
  userBook: '사용자 매뉴얼',
  table: {
    sql: 'SQL',
    sqlFingerprint: 'SQL 지문',
    source: 'DB 인스턴스',
    schema: '스키마',
    result: '감사 결과',
    count: '발생 횟수',
    firstAppearTime: '첫 등장 시간',
    lastReceiveTime: '마지막 등장 시간',
    creator: '생성자',
    createWhitelist: 'SQL 관리 화이트리스트에 추가'
  },
  drawerTitle: 'IDE 감사 결과'
};
