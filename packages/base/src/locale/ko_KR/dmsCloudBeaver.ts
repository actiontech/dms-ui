// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL 콘솔',
  pageDescribe:
    '접근 권한이 있는 DB 인스턴스에 대해 감사된 SQL 작업을 수행할 수 있습니다.',
  eeErrorTips:
    '이 환경에서는 SQL 쿼리가 구성되어 있지 않습니다. 사용하기 전에 설정해 주세요.',
  eeErrorTips2: '구성 방법 및 사용 지침은 문서를 참조하세요.',
  jumpToCloudBeaver: 'SQL 콘솔 열기',
  ceTips:
    'SQL 콘솔에서 생성된 데이터 작업에 대한 세밀한 감사 및 로깅이 필요할 때, SQL 콘솔 감사 기능을 사용하여 데이터 작업의 추적성과 책임성을 보장할 수 있습니다.',
  statistic: {
    total: '실행된 총 SQL',
    succeedTotal: '성공률',
    interceptedTotal: '감사에 의해 차단된 비정상 SQL',
    failedTotal: '실패한 SQL 실행'
  },
  sqlAuditResult: 'SQL 감사 결과',
  operationList: {
    exportButton: '내보내기',
    exportTips: 'SQL 작업 기록 내보내는 중',
    column: {
      operationUser: '작업자',
      operationTime: '작업 시간',
      service: 'DB 인스턴스',
      operationDetail: '작업 세부 정보',
      sessionId: '세션 ID',
      operationIP: '작업 IP',
      auditResult: '감사 결과',
      execResult: '실행 결과',
      execTime: '실행 시간 (ms)',
      rowCount: '결과 집합 행 수'
    },
    createWhitelist: '감사 화이트리스트에 추가'
  }
};
