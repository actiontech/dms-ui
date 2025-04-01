// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '스마트 스캔',
  pageDesc:
    '스마트 스캔 기능을 사용하여 SQL의 품질을 모니터링하고 평가하기 위한 스캔 작업 보고서를 생성할 수 있습니다.',

  list: {
    title: '스캔 작업 목록',
    filter: {
      all: {
        dataSource: '모든 DB 인스턴스',
        taskType: '모든 작업 유형'
      }
    },
    tip: {
      token: {
        show: '다시 클릭하여 숨기기',
        hide: '암호화됨, 세부 정보를 보려면 클릭하고, 다시 클릭하면 숨김'
      }
    },
    table: {
      audit_plan_cron: '감사 주기',
      audit_plan_db_type: '데이터베이스 유형',
      audit_plan_instance_database: '감사 대상 데이터베이스',
      audit_plan_instance_name: 'DB 인스턴스 이름',
      audit_plan_name: '작업 이름',
      audit_plan_token: '접근 자격 증명',
      audit_plan_token_tips: '감사 작업을 위한 자격 증명 업로드에 사용',
      audit_plan_type: '작업 유형',
      audit_rule_template: '감사 규칙 템플릿'
    },
    operator: {
      notice: '감사 실패 메시지 구독'
    }
  },

  action: {
    create: '스캔 작업 생성',
    backButton: '스캔 작업 목록으로 돌아가기',
    backDetail: '스캔 작업 세부 정보로 돌아가기'
  },

  remove: {
    confirm: '스캔 작업 {{name}}을(를) 제거하시겠습니까?',
    loading: '스캔 작업 {{name}} 제거 중...',
    successTips: '스캔 작업 {{name}}이(가) 성공적으로 제거되었습니다'
  },

  create: {
    title: '스캔 작업 생성',
    form: {
      name: '스캔 작업 이름'
    },
    subTitle: {
      dataSource: 'DB 인스턴스 선택',
      editTaskDetail: '작업 세부 정보 편집',
      chooseAuditTemplate: '감사 템플릿 선택',
      customTaskAuditCycle: '사용자 정의 작업 감사 주기'
    },
    successTitle: '스캔 작업이 성공적으로 생성되었습니다',
    successGuide: '스캔 작업 세부 정보 보기',
    clonePlan: '스캔 작업 복제'
  },

  update: {
    title: '스캔 작업 {{name}} 업데이트',
    successTitle: '스캔 작업 {{name}}이(가) 성공적으로 업데이트되었습니다',
    successGuide: '스캔 작업 목록으로 돌아가기'
  },

  planForm: {
    dataSource: {
      dbType: 'DB 인스턴스 유형',
      databaseName: {
        label: 'DB 인스턴스 이름',
        tip: 'DB 인스턴스를 지정하지 않으면 스캔 작업은 선택한 데이터베이스 유형의 기본 규칙 템플릿을 정적 감사에 사용합니다'
      },
      schema: '데이터베이스'
    },
    taskDetail: {
      taskType: '작업 유형'
    },

    auditTemplate: {
      ruleTemplateName: {
        label: '감사 규칙 템플릿',
        tip: '지정하지 않으면 DB 인스턴스에 바인딩된 템플릿이 우선적으로 사용됩니다'
      }
    },
    cronName: {
      label: '작업 감사 주기',
      tip: 'crontab 형식의 시간을 수동으로 입력하거나 오른쪽 버튼을 클릭하여 시각적 선택을 활성화합니다'
    }
  },

  detail: {
    action: {
      audit: '지금 감사'
    },
    tip: {
      rate: '감사 결과 점수'
    }
  },

  detailPage: {
    pageTitle: '작업 이름: {{name}}',
    auditTaskType: '작업 유형: {{type}}',
    pageDesc:
      '여기에서 현재 스마트 스캔 작업의 SQL 통계와 현재 작업의 감사 기록을 볼 수 있습니다'
  },

  sqlPool: {
    title: 'SQL 통계',

    table: {
      fingerprint: 'SQL 지문',
      lastReceiveText: '이 지문과 일치하는 마지막 명령문',
      lastReceiveTime: '이 지문과 일치한 마지막 시간',
      count: '이 지문과 일치하는 명령문 수'
    },

    action: {
      trigger: '지금 감사',

      loading: '감사 트리거 중...',
      triggerSuccess: '감사가 성공적으로 트리거되었습니다'
    }
  },

  record: {
    generateTime: '생성 시간',
    highRuleLevel: '감사에서 발견된 가장 높은 오류 수준'
  },

  planTaskRecord: {
    title: '감사 기록',
    passRage: '감사 통과율'
  },

  report: {
    time: '보고서 생성 시간: {{time}}',
    sourceLabel: '감사 보고서 점수',
    passRageLabel: '감사 통과율',
    rule_template: '규칙 템플릿: {{name}}',
    status_pass_text: '감사 통과',
    drawer: {
      title: 'SQL 감사 결과',
      action: '명령문 분석',
      subTitle: {
        result: '감사 결과',
        sql: 'SQL 명령문'
      },
      source: '소스 파일',
      sourceTip: '현재 zip/git 파일의 SQL 소스만 볼 수 있습니다',
      fileLine: '줄 번호'
    },
    exportBtnText: '스캔 작업 보고서 다운로드',

    table: {
      sql: 'SQL 명령문',
      result: '감사 결과',
      analyze: '분석'
    }
  },

  subscribeNotice: {
    title: '감사 실패 메시지 구독',

    form: {
      interval: '알림 간격(분)',
      intervalTips:
        '알림 간격은 두 번의 푸시 사이의 최소 시간 간격을 의미합니다. 푸시 후 "간격 시간" 내에 감사에서 오류가 발생해도 알림이 전송되지 않습니다. 간격 시간이 지나고 새로운 오류가 트리거된 후에야 다음 알림이 전송됩니다. 모든 푸시를 받으려면 이 간격을 0으로 설정할 수 있습니다',

      level: '경고 수준 임계값',
      levelTips:
        '감사 결과에서 선택한 경고 수준보다 높거나 같은 경고 수준의 오류만 푸시를 트리거합니다',

      emailEnable: '이메일 알림 활성화',
      emailEnableTips: '이메일은 스캔 작업 생성자에게 전송됩니다',

      webhooksEnable: '웹훅 알림 활성화',
      webhooksEnableCe: '웹훅 알림은 기업 에디션 기능입니다',
      webhooksUrl: '웹훅 URL',
      webhooksTemplate: '웹훅 템플릿(JSON)',

      webhooksTemplateHelp: {
        title: '템플릿을 작성할 때 다음 규칙을 따르세요',
        rule1:
          '올바른 JSON 형식으로 템플릿을 작성하세요. 이론적으로 필드 이름, 필드 수 등에 제한이 없습니다. JSON 형식이 올바른지만 확인하면 됩니다.',
        rule2:
          '템플릿의 변수는 푸시 중에 자동으로 대체됩니다. 변경 사항은 아래 변수 설명을 참조하세요',

        supportVariable: '지원되는 변수',
        table: {
          desc: '변수 설명',
          variable: '변수'
        },
        variable: {
          subject: '경고 제목',
          body: '경고 내용'
        },

        reset: '템플릿을 기본 템플릿으로 재설정'
      },

      test: '테스트 메시지 보내기',
      testTips: '테스트하기 전에 먼저 구성을 제출하세요',
      testLoading:
        '스캔 작업 {{name}}의 구독 구성으로 테스트 메시지를 보내는 중...',
      testSuccess: '테스트 메시지가 성공적으로 전송되었습니다',
      subscribeNoticeSuccess: '구독 성공'
    }
  }
};
