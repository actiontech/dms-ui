// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL 콘솔',
  pageDescribe:
    '접근 권한이 있는 데이터 소스에 대해 감사된 SQL 작업을 수행할 수 있습니다.',
  eeErrorTips:
    '이 환경에서는 SQL 쿼리가 구성되어 있지 않습니다. 사용하기 전에 구성해 주세요.',
  eeErrorTips2: '구성 방법 및 사용 지침은 문서를 참조하세요.',

  jumpToCloudbeaver: 'SQL 콘솔 열기',

  databaseTables: {
    title: '데이터베이스 테이블',
    tabTitle: '{{tableName}} 구조',
    columns: '열 정보',
    index: '인덱스 정보',
    createdTableSql: '테이블 생성 문'
  },

  executeResult: {
    title: '실행 결과',
    errorMessageTitle: '쿼리 오류',
    resultTitle: '결과 {{index}}',
    paginationInfo:
      '현재 데이터는 {{current_page}} 페이지에 있으며, {{start_line}}부터 {{end_line}}까지의 레코드를 표시하고 있습니다. 쿼리 시간: {{execution_time}}ms'
  },

  executePlan: {
    title: '실행 계획 {{index}}',
    sql: 'SQL 문',
    sqlExplain: '실행 계획',
    performanceStatistics: '성능 통계',
    affectRows: '영향 받은 행',
    affectRowTips:
      '실행 계획의 행 열과 다르게, 이는 SQL에 의해 실제로 영향 받은 행 수를 보여줍니다.'
  }
};
