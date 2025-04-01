// eslint-disable-next-line import/no-anonymous-default-export
export default {
  common: {
    backToConf: '지능형 스캔 구성으로 돌아가기'
  },
  list: {
    pageTitle: 'SQL 관리 구성',
    pageAction: {
      enableAuditPlan: 'DB 인스턴스에 대한 스캔 작업 활성화',
      planType: '작업 유형'
    },

    table: {
      filter: {
        taskType: {
          allDataSource: '모든 DB 인스턴스',
          allTaskType: '모든 작업 유형'
        },
        status: {
          disabled: '비활성화됨',
          normal: '정상'
        }
      },
      column: {
        staticScanType: '정적 스캔',
        dbName: 'DB 인스턴스 이름',
        dbType: 'DB 인스턴스 유형',
        business: '비즈니스',
        enabledScanTypes: '활성화된 스캔 유형',
        dbTaskStatus: 'DB 인스턴스 작업 상태',
        taskStatus: {
          disabled: '비활성화됨',
          normal: '활성화됨'
        },
        scanStatus: '수집 상태',
        notificationMethod: '알림 방법',
        createdAt: '생성 시간',
        creator: '생성자'
      },
      action: {
        disabled: {
          text: '비활성화',
          confirmTips:
            '비활성화 후 모든 데이터가 더 이상 업데이트되지 않습니다. 비활성화하시겠습니까?',
          successTips: '성공적으로 비활성화되었습니다'
        },
        enabled: {
          text: '활성화',
          successTips: '성공적으로 활성화되었습니다'
        },
        delete: {
          confirmTips:
            '삭제 후 모든 데이터가 더 이상 유지되지 않습니다. 삭제하시겠습니까?',
          successTips: '성공적으로 삭제되었습니다'
        }
      }
    }
  },
  create: {
    title: 'DB 인스턴스에 대한 스캔 작업 활성화',
    dataSourceSelection: 'DB 인스턴스 선택',
    dataSourceNeedsAudit: 'DB 인스턴스 감사가 필요합니까',
    businessScope: '비즈니스',
    instanceName: 'DB 인스턴스 이름',
    instanceNameTips: '비즈니스를 선택하여 해당 DB 인스턴스 가져오기',
    schema: '데이터베이스',
    schemaTips: '데이터베이스를 선택하면 해당 데이터베이스의 SQL만 수집됩니다',
    scanTypesSelection: '스캔 유형 선택',
    scanType: '스캔 유형',
    scanTypeRequiredMessage: '하나의 스캔 작업 선택',
    scanTypeTips: '스캔이 필요한 SQL 객체 선택',
    emptyScanTypeTips:
      'DB 인스턴스 유형을 선택하여 해당 스캔 작업 유형 가져오기',

    scanTypeParams: {
      title: '스캔 세부 정보 편집·{{typeName}}',
      hightPriorityConditions: {
        mark: '높은 우선순위 SQL 표시',
        standard: '표준',
        threshold: '임계값',
        operator: '연산자'
      },
      auditTemplate: {
        ruleTemplate: {
          label: '감사 규칙 템플릿',
          tip: '지정하지 않으면 DB 인스턴스에 바인딩된 템플릿이 우선적으로 사용됩니다'
        }
      }
    },

    defaultScanTypes: {
      sqlFile: 'SQL 파일',
      myBatisFile: 'MyBatis 파일',
      allAppExtract: '애플리케이션 SQL 캡처',
      default: '사용자 정의'
    },

    result: {
      title: 'SQL 관리 구성 생성 성공',
      reset: '양식 초기화',
      jumpToDetail: '구성 세부 정보 보기'
    }
  },
  update: {
    successTips: '지능형 스캔 구성 업데이트 성공!'
  },
  detail: {
    title: '{{instanceName}} 지능형 스캔 세부 정보',
    staticScanTypes: '정적 스캔',
    export: '내보내기',
    auditImmediately: '즉시 감사',
    auditImmediatelySuccessTips: '감사 성공',
    exportTips: '스캔 작업 세부 정보 내보내는 중',
    overview: {
      title: '개요',
      column: {
        auditPlanType: '지능형 스캔 유형',
        auditRuleTemplate: '감사 규칙 템플릿',
        status: '작업 상태',
        scanType: '수집 방법',
        connectionInfo: '연결 정보',
        collectedSqlCount: '수집된 SQL 수',
        problematicSqlCount: '문제가 있는 SQL 수',
        lastCollectionTime: '마지막 수집 시간'
      },
      actions: {
        enabled: '활성화',
        enabledSuccessTips: '성공적으로 활성화되었습니다!',
        disabled: '비활성화',
        disabledSuccessTips: '성공적으로 비활성화되었습니다!',
        disabledConfirmTips:
          '비활성화 후 이 유형의 SQL은 더 이상 스캔되지 않으며, 현재 데이터는 유지됩니다. 비활성화하시겠습니까?',
        delete: '삭제',
        deleteSuccessTips: '성공적으로 삭제되었습니다!',
        deleteConfirmTips:
          '삭제 후 이 유형의 지능형 스캔 데이터는 더 이상 유지되지 않습니다. 삭제하시겠습니까?'
      }
    },
    scanTypeSqlCollection: {
      filter: {
        searchInputPlaceholder: 'SQL, 규칙 이름 입력'
      },
      action: {
        urgentAudit: '즉시 감사',
        lastAuditTime: '마지막 감사 시간: {{time}}'
      },

      column: {
        index: '인덱스',
        sqlFingerprint: 'SQL 지문',
        source: '소스',
        belongingDataSource: '소속 DB 인스턴스',
        execTime: '실행 시간',
        lastAppearanceTime: '마지막 출현 시간',
        firstAppearanceTime: '첫 출현 시간',
        occurrenceCount: '발생 횟수',
        status: '상태',
        explanation: {
          text: '설명',
          operator: '설명 추가'
        },
        sqlAuditResultReportTitle: 'SQL 감사 결과',
        action: {
          analysis: '분석'
        }
      }
    }
  }
};
