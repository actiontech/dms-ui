// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '프로젝트 관리',
  pageDescribe:
    '프로젝트 관점에서 sqle 플랫폼의 리소스와 기능을 구성하고 관리합니다. 프로젝트를 진입점으로 다양한 감사 기능을 지원합니다. 서로 다른 프로젝트 간에 리소스가 격리됩니다.',

  projectList: {
    title: '프로젝트 목록',
    deleteSuccessTips: '프로젝트 "{{name}}" 삭제 성공',
    createProject: '프로젝트 생성',
    archiveProjectSuccessTips: '프로젝트 "{{name}}" 보관 성공',
    unarchiveProjectSuccessTips: '프로젝트 "{{name}}" 보관 해제 성공',
    column: {
      name: '프로젝트 이름',
      desc: '프로젝트 설명',
      status: '프로젝트 상태',
      createTime: '생성 시간',
      createUser: '생성자',
      available: '사용 가능',
      unavailable: '사용 불가',
      deleteProjectTips: '프로젝트 "{{name}}"을(를) 삭제하시겠습니까?',
      archive: '보관',
      unarchive: '보관 해제',
      archiveProjectTips: '프로젝트 "{{name}}"을(를) 보관하시겠습니까?',
      unarchiveProjectTips: '프로젝트 "{{name}}"의 보관을 해제하시겠습니까?'
    },
    allProject: '모든 프로젝트 보기',

    searchProject: {
      placeholder: '프로젝트 검색',
      recentlyOpenedProjects: '최근에 열린 프로젝트',
      notSearched: '프로젝트를 찾을 수 없습니다',
      notRecentlyOpenedProjects: '최근에 열린 프로젝트 없음'
    }
  },
  createProject: {
    modalTitle: '프로젝트 생성',
    createSuccessTips: '프로젝트 "{{name}}" 생성 성공'
  },
  updateProject: {
    modalTitle: '프로젝트 편집',
    updateSuccessTips: '프로젝트 "{{name}}" 업데이트 성공'
  },

  projectForm: {
    projectName: '프로젝트 이름',
    projectDesc: '프로젝트 설명'
  },

  projectInfoBox: {
    name: '프로젝트 이름: {{name}}',
    desc: '프로젝트 설명: {{desc}}',
    createTime: '생성 시간: {{time}}',
    createUser: '생성자: {{user}}'
  },

  projectDetail: {
    notice: '알림',
    unboundProjectTips:
      '현재 사용자가 어떤 프로젝트에도 바인딩되어 있지 않습니다. 프로젝트 관리자에게 문의하세요.'
  },

  projectOverview: {
    pageTitle: '프로젝트 개요',
    projectScore: {
      title: '프로젝트 점수',
      newScore: '최신 점수',
      level: {
        dangerous: '위험',
        warning: '경고',
        good: '양호',
        excellent: '우수'
      }
    },

    sqlCount: {
      title: 'SQL 통계',
      riskRate: '위험률',
      SQLCount: '전체 SQL',
      riskSQL: '위험 SQL',
      riskSQLNumber: '위험 SQL 수'
    },
    dataSourceCount: {
      title: 'DB 인스턴스',
      health: '정상 인스턴스',
      risk: '위험 인스턴스',
      tips: '인스턴스에 실패/거부된 온라인 워크플로우가 있거나 최신 스캔 작업 보고서 점수가 60 미만인 경우, 해당 인스턴스는 위험 인스턴스로 간주됩니다',
      riskNum: '위험 인스턴스 {{num}}개',
      healthNum: '정상 인스턴스 {{num}}개'
    },
    orderClassification: {
      title: '주문',
      button: '워크플로우 생성',
      total: '전체 워크플로우',
      closed: '종료됨',
      executing: '온라인 진행 중',
      executionSuccess: '온라인 성공',
      executionFailed: '온라인 실패',
      rejected: '거부됨',
      waitingForAudit: '감사 대기 중',
      waitingForExecution: '온라인 대기 중'
    },
    orderRisk: {
      title: '워크플로우의 잠재적 위험',
      tableColumn: {
        name: '주문',
        status: '상태',
        time: '시간',
        createUser: '생성자'
      }
    },
    auditPlanClassification: {
      title: '스캔 작업',
      button: '스캔 작업 생성',
      detailTitle: '스캔 작업 세부 정보',
      taskTotal: '전체 스캔 작업',
      dataSourceType: 'DB 인스턴스 유형'
    },
    auditPlanRisk: {
      title: '스캔 작업의 잠재적 위험',
      tableColumn: {
        name: '스캔 작업 보고서',
        source: '소스',
        time: '시간',
        count: '위험 SQL'
      }
    },
    memberInfo: {
      title: '멤버',
      count: '멤버 수',
      action: '멤버 편집'
    },
    approvalProcess: {
      title: '승인 프로세스',
      action: '현재 승인 프로세스 템플릿 편집',
      createStep: '주문 시작',
      review: '주문 승인',
      exec: '주문 온라인',
      match: '권한 일치'
    },
    optimizationDistribution: {
      title: '최적화 쿼리 분포',
      timeLabel: '시간 기간',
      toolTip: {
        label: '최적화 추가'
      }
    },
    dataSourcePerformance: {
      title: 'DB 인스턴스 성능 향상',
      toolTip: {
        label: '성능 향상'
      }
    }
  }
};
