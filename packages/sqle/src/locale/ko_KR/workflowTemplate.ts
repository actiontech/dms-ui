// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '승인 워크플로우 템플릿',
  pageDesc: '여기에서 기본 승인 워크플로우 템플릿을 관리할 수 있습니다.',

  list: {
    title: {
      listTable: '승인 워크플로우 템플릿 목록'
    },

    table: {
      workflowTemplateName: '승인 워크플로우 템플릿 이름',
      desc: '승인 워크플로우 템플릿 설명'
    },

    operator: {
      create: '승인 워크플로우 템플릿 생성'
    }
  },

  create: {
    title: {
      returnButton: '승인 워크플로우 템플릿으로 돌아가기',
      wrapper: '승인 워크플로우 템플릿 생성'
    },
    result: {
      title: '승인 워크플로우 템플릿이 성공적으로 생성되었습니다',
      createNew: '새 승인 워크플로우 템플릿 생성',
      backToList: '목록으로 돌아가서 새로 생성된 승인 워크플로우 템플릿 보기'
    }
  },

  update: {
    title: {
      wrapper: '승인 워크플로우 템플릿 업데이트'
    },
    result: {
      title: '승인 워크플로우 템플릿이 성공적으로 업데이트되었습니다',
      showNow: '새로 업데이트된 승인 워크플로우 템플릿 보기'
    }
  },

  delete: {
    confirm: '승인 워크플로우 템플릿 {{name}}을(를) 제거하시겠습니까?',
    deleting: '승인 워크플로우 템플릿 {{name}} 제거 중...',
    successTips:
      '승인 워크플로우 템플릿 {{name}}이(가) 성공적으로 제거되었습니다'
  },

  detail: {
    title: {
      wrapper: '승인 워크플로우 템플릿 세부 정보',
      base: '승인 워크플로우 템플릿 기본 정보',
      step: '승인 워크플로우 템플릿 단계',
      noticeInfo: '알림',
      updateTime: '승인 워크플로우 템플릿 업데이트 시간'
    },
    updateTemplate: '현재 승인 워크플로우 템플릿 수정',
    authLevelInfo: {
      first:
        '프로젝트 관리자가 승인 워크플로우 템플릿을 수정하면 이미 승인 프로세스에 있는 티켓에는 영향을 미치지 않습니다.',
      second:
        '거부된 티켓은 생성자가 SQL 문을 업데이트하고 다시 제출해야 합니다. 거부 기록은 "티켓 진행 상황-티켓 이력 작업"에서 볼 수 있습니다.',
      third:
        '생성자는 티켓 세부 정보 페이지에서 언제든지 "감사 노드"에 있는 티켓을 닫을 수 있습니다.',
      fourth:
        '감사 티켓: 감사자는 이 단계에서 "감사 통과" 또는 "거부" 작업을 실행할 수 있습니다.',
      fifth:
        '온라인 티켓: 실행자는 이 단계에서 "온라인 실행" 또는 "거부" 작업을 실행할 수 있습니다.'
    }
  },

  step: {
    baseFormTitle: '기본 정보',
    baseFormDesc: '템플릿의 기본 정보 설정',

    progressTitle: '감사 노드',
    progressDesc:
      '감사 프로세스를 편집하고, 드래그 앤 드롭으로 감사 노드의 순서를 재배열합니다. 감사자는 이 단계에서 "감사 통과" 또는 "거부" 작업을 실행할 수 있습니다',

    execTitle: '온라인 실행',
    execDesc:
      '감사 프로세스를 편집합니다. 실행자는 이 단계에서 "온라인 실행" 또는 "거부" 작업을 실행할 수 있습니다',

    resultTitle: '결과',
    resultDesc: '결과 변경'
  },

  form: {
    label: {
      name: '승인 워크플로우 템플릿 이름',
      desc: '승인 워크플로우 템플릿 설명',
      allowSubmitWhenLessAuditLevel: '티켓 생성을 위한 최고 감사 수준 허용',
      instanceNameList: '애플리케이션 데이터 소스',
      reviewUser: '감사자',
      reviewUserType: '감사자 유형',
      reviewDesc: '단계 설명',
      execUser: '실행자',
      execUserType: '실행자 유형'
    },
    rule: {
      descMessage: '단계 설명은 255자를 초과할 수 없습니다',
      userRequired: '최소한 한 명의 지정된 사람을 추가해야 합니다',
      userMessage: '최대 세 명의 지정된 사람만 추가할 수 있습니다'
    }
  },

  progressConfig: {
    levelStep: {
      desc: '최고 수준'
    },
    createStep: {
      title: '티켓 시작/티켓 업데이트 SQL 문',
      desc: '티켓이 생성되거나, 티켓이 거부되어 SQL 문 수정을 기다리는 중'
    },
    review: {
      title: '감사 노드',
      subTitle:
        '감사자는 이 단계에서 "감사 통과" 또는 "거부" 작업을 실행할 수 있습니다',
      reviewUserType: {
        specifyAudit: '감사자 지정',
        matchAudit: '데이터 소스 감사 권한이 있는 멤버와 일치'
      }
    },
    exec: {
      title: '온라인 실행',
      subTitle:
        '실행자는 이 단계에서 "온라인 실행" 또는 "거부" 작업을 실행할 수 있습니다',
      executeUserType: {
        specifyExecute: '실행자 지정',
        matchExecute: '데이터 소스 온라인 권한이 있는 멤버와 일치'
      }
    },
    operator: {
      remove: '이 단계 제거',
      moveUp: '이 단계를 위로 이동',
      moveDown: '이 단계를 아래로 이동',
      addReview: '감사 노드 추가'
    },
    ruler: {
      title: '승인 워크플로우를 생성/업데이트할 때 다음 사항에 유의하세요:',
      rule1:
        '승인 프로세스는 티켓 시작부터 시작하여 설정된 감사 단계를 통과한 후 온라인 실행으로 끝납니다.',
      rule2:
        '승인 워크플로우 템플릿은 최대 4개의 감사 단계를 설정할 수 있으며, 감사 단계를 설정하지 않을 수도 있습니다.',
      rule3:
        '단일 단계에 대해 실행자를 지정할 때 최소한 한 명의 지정된 사람을 추가해야 하며, 최대 세 명의 지정된 사람을 추가할 수 있습니다.'
    }
  },

  auditLevel: {
    normal: '정상',
    error: '오류',
    warn: '경고',
    notice: '알림'
  }
};
