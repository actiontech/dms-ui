// eslint-disable-next-line import/no-anonymous-default-export
export default {
  result: '감사 결과',
  passRage: '감사 통과율',
  source: '감사 점수',
  duplicate: '중복 제거',
  downloadSql: 'SQL 문 다운로드',
  downloadReport: '감사 보고서 다운로드',
  table: {
    number: '번호',
    auditLevel: '규칙 수준',
    auditStatus: '감사 상태',
    auditResult: '감사 결과',
    execSql: '실행 명령문',
    execStatus: '실행 상태',
    execResult: '실행 결과',
    rollback: '롤백 명령문',
    rollbackTips: '알림만 표시, 롤백은 지원되지 않음',
    describe: '설명',
    analyze: '분석',
    addDescribe: '설명 추가'
  },

  filterForm: {
    highestAuditLevel: '최고 감사 경고 수준'
  },

  sqlFileSource: {
    tips: '현재 SQL/ZIP 파일의 SQL 소스만 볼 수 있습니다',
    source: '소스 파일',
    fileLine: '줄 번호'
  },

  execStatus: {
    initialized: '실행 준비 완료',
    doing: '실행 중',
    succeeded: '실행 성공',
    failed: '실행 실패',
    manually_executed: '수동 실행',
    terminate_fail: '종료 실패',
    terminate_succ: '종료 성공',
    terminating: '종료 중',
    allStatus: '모든 상태'
  },

  auditStatus: {
    initialized: '감사 준비 완료',
    doing: '감사 중',
    finished: '감사 완료'
  },
  copyExecSql: '실행 명령문 복사',
  auditSuccess: '감사 통과',

  fileModeExecute: {
    headerTitle: '파일 정보 개요',
    sqlsTips: '처음 5개 데이터만 표시됩니다, <0>더 보기<0>'
  },
  fileModeSqls: {
    backToDetail: '워크플로우 세부 정보로 돌아가기',
    title: '파일 정보 세부 사항',

    statistics: {
      audit: '감사 결과 정보',
      execute: '실행 결과 정보'
    }
  }
};
