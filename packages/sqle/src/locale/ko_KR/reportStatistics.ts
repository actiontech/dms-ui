// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: '보고서 통계',
  cardLine: {
    title: {
      orderTotal: '전체 워크플로우',
      todayIncreased: '오늘 새로운 워크플로우',
      orderAverageAuditTime: '평균 워크플로우 감사 시간',
      auditPassRate: '감사 통과율'
    },
    noteCont: {
      deadline: '마감 시간 {{time}}',
      orderAverageAuditTime: {
        min: '최단 시간',
        max: '최장 시간'
      },
      auditPassRate: {
        passed: '통과',
        notPass: '미통과'
      }
    }
  },
  orderQuantityTrend: {
    title: '워크플로우 추세',
    emptyText:
      '아직 데이터가 없습니다. 다른 기간을 선택하거나 워크플로우를 생성한 후 이 페이지로 돌아오세요',
    timeLabel: '기간:',
    toolTip: {
      label: '새 워크플로우'
    }
  },
  workOrderState: {
    title: '워크플로우 상태별 구성',
    emptyText:
      '아직 데이터가 없습니다. 워크플로우를 생성한 후 이 페이지로 돌아오세요',
    state: {
      waiting_for_audit: '감사 대기 중',
      waiting_for_execution: '실행 대기 중',
      executing: '실행 중',
      rejected: '거부됨',
      executing_failed: '실행 실패',
      closed: '종료됨',
      execution_success: '실행 성공'
    }
  },
  databaseTypeOrder: {
    title: '데이터베이스 유형별 워크플로우 구성',
    emptyText:
      '아직 데이터가 없습니다. 워크플로우를 생성한 후 이 페이지로 돌아오세요',
    tooltip: {
      number: '주문 수량',
      proportion: '주문 비율'
    }
  },
  databaseSourceOrder: {
    title: '데이터베이스 유형별 데이터 소스 구성',
    emptyText:
      '아직 데이터가 없습니다. 데이터 소스를 구매한 후 이 페이지로 돌아오세요',
    sourceTotal: '전체 데이터 소스',
    sourceNumItem: '데이터 소스 수량',
    sourceProportionItem: '데이터 소스 비율'
  },
  licenseStatistics: {
    title: '라이선스 사용량',
    emptyText:
      '아직 데이터가 없습니다. 라이선스를 구매한 후 이 페이지로 돌아오세요',
    used: '사용됨',
    proportion: '비율',
    charts: {
      validity: '유효 기간',
      user: '사용자 수',
      instanceNum: '인스턴스 수'
    }
  },
  topList: {
    diffOrderReject: {
      title: '사용자별 주문 거부율 (상위 10개)',
      noData:
        '아직 데이터가 없습니다. 워크플로우를 생성한 후 이 페이지로 돌아오세요',
      column: {
        creator: '사용자 이름',
        workflow_total_num: '전체 워크플로우',
        rejected_percent: '거부율'
      }
    },
    sqlOnLineSpendTime: {
      title: '평균 SQL 실행 시간 (상위 10개)',
      noData:
        '아직 데이터가 없습니다. 워크플로우를 생성한 후 이 페이지로 돌아오세요',
      column: {
        instance_name: '데이터 소스 이름',
        average_execution_seconds: '평균 실행 시간',
        max_execution_seconds: '최장 실행 시간',
        min_execution_seconds: '최단 실행 시간'
      }
    }
  },
  tableTopList: {
    noData: '데이터 없음',
    noMoreData: '더 이상 데이터 없음'
  },
  ce: {
    feature: {
      desc: '관리자가 플랫폼 비즈니스의 감사 진행 상황과 플랫폼 사용량을 완전히 이해해야 하는 경우, 보고서 통계 기능을 사용할 수 있습니다. 이 기능은 다차원 비즈니스 분석 관점을 제공하여 관리자가 워크플로우의 감사 효율성과 제출된 SQL의 품질을 이해하도록 도와, SQL 감사 작업을 더 효율적이고 유연하게 수행할 수 있게 합니다.'
    }
  }
};
