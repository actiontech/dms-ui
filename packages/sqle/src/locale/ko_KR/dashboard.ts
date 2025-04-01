// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '워크벤치',
  pageDesc: '프로젝트를 필터링하고 해당 워크벤치 데이터를 볼 수 있습니다',
  tableLimitTips: '현재 테이블은 상위 {{number}} 데이터만 표시합니다',
  allProjectTip: '모든 프로젝트',
  projectName: '프로젝트 이름',
  title: {
    pendingOrder: '대기 중인 워크플로우',
    myOrderSituation: '내 워크플로우 상황',
    auditPlanRisk: '대기 중인 스캔 작업'
  },
  pendingOrder: {
    needMeReview: '감사 필요',
    needMeExec: '실행 필요'
  },
  myOrderSituation: {
    pendingReviewByMe: '감사 대기 중',
    pendingExecByMe: '실행 대기 중',
    rejectedOrderByMe: '거부됨'
  },
  auditPlanRisk: {
    tableColumn: {
      name: '스캔 작업 보고서',
      source: 'DB 인스턴스',
      time: '시간',
      count: '위험 SQL'
    }
  }
};
