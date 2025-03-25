// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL 최적화',
  ceTips:
    'SQL 재작성 제안을 얻고 SQL 실행 성능을 최적화해야 할 때, 플랫폼에서 제공하는 SQL 최적화 기능을 사용할 수 있으며, SQL 재작성, 인덱스 최적화, 성능 검증과 같은 여러 최적화 결과를 얻을 수 있습니다',
  table: {
    optimizationId: '최적화 ID',
    optimizationName: '이름',
    instanceName: 'DB 인스턴스',
    dbType: 'DB 유형',
    performanceGain: '성능 향상',
    createTime: '생성 시간',
    status: '상태',
    creator: '생성자'
  },
  status: {
    finish: '최적화 성공',
    failed: '최적화 실패',
    optimizing: '최적화 진행 중'
  },
  create: {
    linkButton: 'SQL 최적화 생성',
    returnButton: 'SQL 최적화 목록으로 돌아가기',
    successTips: 'SQL 최적화 생성 성공',
    base: {
      title: 'SQL 최적화 생성',
      name: 'SQL 최적화 이름'
    },
    sqlInfo: {
      title: 'SQL 입력',
      dbType: 'DB 유형',
      instanceName: 'DB 인스턴스',
      instanceSchema: '데이터베이스',
      uploadType: 'SQL 문 업로드 방법 선택',
      optimize: '최적화',
      tips: '최적화 결과의 정확도를 높이기 위해 시스템이 데이터베이스 분석 작업을 수행합니다',
      format: 'SQL 미화',
      formatTips:
        '현재 SQL 미화를 지원하는 데이터베이스 유형은 {{supportType}}입니다. 데이터 소스를 선택하지 않았거나 선택한 데이터 소스 유형이 아직 지원되지 않는 경우, SQL 미화로 인해 SQL 문 구문 오류가 발생할 수 있습니다.'
    }
  },
  overview: {
    sqlTable: {
      order: '순서',
      sql: 'SQL 텍스트',
      syntaxError: '구문 오류',
      recommendedIndex: '추천 인덱스',
      hitIndex: '히트 인덱스',
      rewriteNumber: '재작성 최적화',
      performanceImprovement: '성능 향상',
      indexUsed: '사용된 인덱스',
      buttonText: '최적화 세부 정보'
    },
    optimizationOverview: {
      title: '최적화 개요',
      queryNumber: '파싱된 SQL',
      rewriteNumber: '최적화된 SQL',
      indexNumber: '최적화된 추천 인덱스',
      performance: '최적화 후 성능 향상'
    },
    recommendedIndex: '추천 인덱스',
    recommendedIndexTips: '각 SQL을 기반으로 생성된 인덱스 추천 집중 표시',
    sqlTableTitle: 'SQL 문 목록',
    indexTips: '최적화가 필요한 인덱스가 없습니다',
    optimizingStatusTips:
      '최적화가 진행 중입니다. 최신 결과를 얻으려면 새로 고침하세요',
    failedStatusTips: '최적화 실패'
  },
  detail: {
    returnButton: '성능 최적화 개요로 돌아가기',
    sqlRewrite: {
      title: 'SQL 재작성',
      originalSql: '원본 SQL',
      optimizedSql: '재작성된 SQL'
    },
    triggeredRule: {
      title: '이 재작성 최적화에 적용된 규칙'
    },
    recommenderIndex: {
      title: '추천 인덱스'
    },
    performanceValidation: {
      title: '성능 검증',
      performImprove: '성능 향상',
      performImproveDesc:
        '이 최적화가 구현된 후 이 SQL의 성능이 향상될 것으로 예상됩니다',
      beforePlan: '실행 계획 (최적화 전)',
      afterPlan: '실행 계획 (최적화 후)'
    }
  }
};
