// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: {
    pageTitle: '워크플로우 목록',
    pageDesc: '워크플로우 목록은 사용자와 관련된 워크플로우만 표시합니다.',

    allWorkflowAboutMe: '나와 관련된 모든 워크플로우',
    workflowStatus: {
      review: '감사 대기 중',
      exec: '실행 대기 중'
    },
    batchClose: {
      buttonText: '일괄 종료',
      closePopTitle: '선택한 워크플로우를 종료하시겠습니까?',
      messageWarn:
        '선택한 워크플로우 중 종료할 수 없는 워크플로우가 포함되어 있습니다! (상태가 "{{process}}" 및 "{{reject}}"인 워크플로우만 종료할 수 있습니다.)'
    },

    exportWorkflow: {
      buttonText: '워크플로우 내보내기',
      exporting: '과거 워크플로우 내보내기 중',
      exportSuccessTips: '과거 워크플로우 내보내기 성공'
    },

    createButtonText: '워크플로우 생성',

    name: '워크플로우 이름',
    dataSource: 'DB 인스턴스',
    schema: '데이터베이스',
    schemaPlaceholder: '데이터베이스 선택 (선택사항)',
    createUser: '생성자',
    assignee: '담당자',
    createTime: '생성 시간',
    executeTime: '실행 시간',
    desc: '워크플로우 설명',
    status: '워크플로우 상태',
    time: '예약된 시간',
    stepType: '현재 단계 유형',
    sqlTaskStatus: 'SQL 감사 상태',
    instanceName: 'DB 인스턴스',
    passRate: '감사 통과율',
    taskScore: '감사 점수',
    id: '워크플로우 ID',
    version: '버전'
  },
  create: {
    backToList: '워크플로우 목록으로 돌아가기',
    title: '워크플로우 생성',
    currentVersion: '현재 버전',
    mustAuditTips: '워크플로우를 생성하기 전에 SQL을 감사해야 합니다',
    mustHaveAuditResultTips:
      '감사 결과가 없는 SQL에 대해서는 워크플로우를 생성할 수 없습니다',

    form: {
      baseInfo: {
        title: '기본 워크플로우 정보',

        name: '워크플로우 이름',
        workflowNameRule:
          '문자, 숫자, 한글, 하이픈 및 밑줄만 포함할 수 있습니다',
        describe: '워크플로우 설명',
        describePlaceholder: '워크플로우 설명 추가하기 (선택사항)'
      },

      sqlInfo: {
        title: 'SQL 문 감사 정보',

        isSameSqlForAll: '동일한 SQL 선택',
        tipsDataSourceTypeForSameSql:
          '데이터 소스 유형이 동일한 경우에만 동일한 SQL 모드를 사용할 수 있습니다',
        sameSql: '동일한 SQL',
        differenceSql: '다른 SQL',

        instanceName: 'DB 인스턴스',

        instanceNameTips:
          '나중에 추가된 데이터 소스 워크플로우 템플릿은 현재 데이터 소스와 동일합니다',
        instanceSchema: '데이터베이스',
        schemaPlaceholder: '데이터베이스 선택 (선택사항)',

        sql: 'SQL 문',
        sqlFile: 'SQL 파일',
        sqlFileTips: 'SQL 파일을 선택하거나 이 영역에 파일을 끌어다 놓으세요',
        mybatisFile: 'Mybatis XML 파일',
        mybatisFileTips:
          'XML 파일을 선택하거나 이 영역에 파일을 끌어다 놓으세요',
        zipFile: 'Zip 파일',
        zipFileTips:
          'Zip 파일을 선택하거나 이 영역에 파일을 끌어다 놓으세요. 현재 ZIP 파일 내 .xml 및 .sql 파일의 SQL 감사만 지원합니다',

        addInstanceTips: 'DB 인스턴스를 추가해주세요',
        addInstance: 'DB 인스턴스 추가',
        uploadType: 'SQL 문 업로드 방법 선택',
        manualInput: 'SQL 문 입력',
        uploadFile: 'SQL 파일 업로드',
        updateMybatisFile: 'Mybatis XML 파일 업로드',
        uploadZipFile: 'ZIP 파일 업로드',

        audit: '감사',
        analyze: 'SQL 분석',
        format: 'SQL 포맷',
        formatTips:
          '현재 SQL 포맷팅을 지원하는 데이터베이스 유형은 {{supportType}}입니다. 데이터 소스를 선택하지 않았거나 선택한 데이터 소스 유형이 아직 지원되지 않는 경우, SQL 포맷팅으로 인해 SQL 문 구문 오류가 발생할 수 있습니다.',

        selectExecuteMode: '실행 모드 선택',
        selectExecuteModeTips:
          '파일 모드 실행을 선택하면 감사 결과가 파일별로 집계됩니다',
        execModeDisabledTips:
          '현재 MySQL, Oracle, PG 유형 데이터 소스만 파일 모드로 실행할 수 있습니다',
        executeSqlMode: 'SQL 모드',
        executeFileMode: '파일 모드',
        selectFileSortMethod: '파일 정렬 방법 선택'
      },
      tour: {
        modifyName: '워크플로우 이름 수정',
        modifyDataSource: 'DB 인스턴스 수정'
      }
    },

    auditResult: {
      clearDuplicate: '데이터 중복 제거',
      allLevel: '모든 레벨',
      submit: '워크플로우 제출',
      updateInfo: '워크플로우 업데이트',
      disabledOperatorWorkflowBtnTips:
        '프로젝트 {{currentProject}}는 워크플로우 생성 시 최대 {{allowAuditLevel}} 레벨의 감사 오류만 허용할 수 있지만, 현재 감사 결과에는 최대 {{currentAuditLevel}} 레벨의 감사 결과가 포함되어 있습니다.',
      mustHaveAuditResultTips:
        '감사 결과가 없는 SQL에 대해서는 워크플로우를 생성할 수 없습니다',
      leaveTip:
        '이 페이지를 떠나시겠습니까? 현재 워크플로우가 제출되지 않았습니다!'
    },
    createResult: {
      success: '워크플로우가 성공적으로 생성되었습니다',
      guide: '새로 생성된 워크플로우 보기',
      cloneWorkflow: '워크플로우 복제',
      viewWorkflowDetail: '워크플로우 세부 정보 보기'
    }
  },

  detail: {
    operator: {
      buttonText: '워크플로우 상세',
      title: '워크플로우 정보',
      baseInfo: {
        title: '기본 정보',
        createUser: '생성자',
        createTime: '생성 시간',
        status: '워크플로우 상태'
      },
      history: {
        title: '워크플로우 작업 이력'
      },
      stepsTitle: '워크플로우 진행 상황',
      time: '작업 시간',
      user: '작업자',
      reject: '거부',
      rejectFull: '모두 거부',
      markManually: '수동 실행으로 표시',
      markManuallyConfirmTips:
        '이 작업은 워크플로우 상태만 변경하고 데이터 소스에는 작업하지 않습니다. 수동 실행으로 표시하시겠습니까?',
      rejectTips:
        '워크플로우가 거부되면 워크플로우 생성자가 수정한 후 다시 감사를 위해 제출해야 합니다.',
      wait: '사용자 {{username}}의 작업을 기다리는 중',
      waitAudit: '감사자의 작업을 기다리는 중',
      notArrival: '이전 단계 실행을 기다리는 중',
      rejectDetail: '{{name}}님이 현재 워크플로우를 거부했습니다. 거부 이유: ',
      alreadyRejected: '워크플로우가 거부되었습니다',
      alreadyClosed: '워크플로우가 종료되었습니다',
      modifySql: '감사 문장 수정',
      updateEmptyWorkflowTips:
        '감사 결과가 없는 SQL로 현재 워크플로우를 업데이트할 수 없습니다',
      waitModifySql: '사용자 {{username}}의 감사 문장 수정을 기다리는 중',
      batchSqlExecute: '일괄 즉시 실행',
      batchSqlExecuteConfirmTips:
        '이 작업은 워크플로우 아래의 모든 SQL 문을 즉시 실행합니다. 예약된 실행 시간이 설정된 데이터 소스는 여전히 예약된 시간에 실행되며 즉시 실행되지 않습니다. 일괄적으로 즉시 실행하시겠습니까?',
      sqlReview: '감사 통과',
      terminate: '실행 종료',
      terminateSuccessTips: '실행 종료 성공',
      terminateConfirmTips:
        '이 작업은 현재 실행 작업을 중단하고 현재 실행 중인 SQL을 롤백합니다. 실행을 종료하시겠습니까?',
      unknown: '알 수 없는 단계',
      refreshWorkflow: '워크플로우 새로고침',
      backToDetail: '워크플로우 상세로 돌아가기',

      maintenanceTime:
        '예약된 실행 시간은 유지보수 시간 내에 있어야 합니다. 현재 데이터 소스 유지보수 시간은: \n',
      sqlExecuteDisableTips:
        '유지보수 시간 내에서만 즉시 실행할 수 있습니다. 현재 데이터 소스 유지보수 시간은',
      emptyMaintenanceTime: '언제든지',
      scheduleTime: '예약 실행 시간',
      scheduleTimeExecuteConfirmLabel: '실행 전 확인을 위한 알림 보내기',
      scheduleTimeExecuteConfirmTips:
        '활성화하면 예약된 실행 시간이 되었을 때 플랫폼이 실행 확인을 위한 알림을 보내고, 확인 후 실행 작업이 수행됩니다. 비활성화하면 예약된 실행 시간이 되었을 때 자동으로 실행 작업이 수행됩니다',
      scheduleTimeExecuteConfirmMethod: '확인 방법',
      scheduleTimeExecuteConfirmMethodTips:
        '현재 기업용 WeChat과 Feishu만 지원합니다. 해당 프로세스 연동 기능을 구성하지 않은 경우 먼저 <0>시스템 설정-프로세스 연동</0>으로 이동하여 활성화하세요',
      confirmMethodWechat: '기업용 WeChat',
      confirmMethodFeishu: 'Feishu',

      approveSuccessTips: '승인 통과',
      rejectSuccessTips: '거부 성공',
      completeSuccessTips: '동기 워크플로우가 성공적으로 실행되었습니다',
      rejectReason: '거부 이유',
      rejectAllTips:
        '이 작업은 워크플로우 아래의 모든 SQL 문을 거부합니다. 신중하게 작업하세요!',
      onlineRegularly: '예약 실행',
      execScheduledErrorMessage:
        '예약된 실행 시간은 유지보수 시간 내에 있어야 합니다',
      execScheduledBeforeNow: '예약된 실행 시간은 현재 시간 이후여야 합니다',
      execScheduleTips: '예약 실행 설정 성공',
      status: '실행 상태',
      executingTips: '즉시 실행 설정 성공',
      createWorkflowStep: '워크플로우 생성',
      updateWorkflowStep: '워크플로우 업데이트',
      reviewWorkflowStep: '워크플로우 감사',
      executeWorkflowStep: '워크플로우 실행',
      stepNumberIsUndefined: '현재 노드의 단계 번호가 정의되지 않았습니다!',
      closeWorkflow: '워크플로우 종료',
      closeConfirm:
        '작업 주문이 종료되면 더 이상 작업을 수행할 수 없습니다. 현재 작업 주문을 종료하시겠습니까?',
      closeWorkflowSuccessTips: '워크플로우 종료 성공',
      cloneExecWorkflow: '다른 인스턴스에 실행',
      associatedWorkflowInfo: '관련 워크플로우'
    },

    paginationDisplay: '페이지 표시',
    waterfallDisplay: '워터폴 표시',
    overview: {
      title: '개요',
      table: {
        instanceName: 'DB 인스턴스',

        status: '상태',
        execStartTime: '실행 시작 시간',
        execEndTime: '실행 종료 시간',
        scheduleExecuteTime: '예약 실행 시간',
        assigneeUserName: '담당자',
        executeUserName: '실행자',
        passRate: '감사 통과율',
        score: '감사 점수',
        operator: '작업',
        sqlExecute: '즉시 실행',
        scheduleTime: '예약 실행',
        cancelExecScheduled: '예약 실행 취소',
        cancelExecScheduledTips: '예약 실행 취소 성공',
        sqlExecuteConfirmTips:
          '이 작업은 데이터 소스에서 SQL 문을 즉시 실행합니다. 즉시 실행하시겠습니까?'
      }
    },
    taskResult: {}
  },

  audit: {
    result: '감사 결과',
    passRage: '감사 통과율',
    source: '감사 점수',
    duplicate: '중복 제거',
    downloadSql: 'SQL 문 다운로드',
    downloadReport: '감사 보고서 다운로드',
    table: {
      number: '일련번호',
      auditLevel: '규칙 레벨',
      auditStatus: '감사 상태',
      auditResult: '감사 결과',
      execSql: '실행 문장',
      execStatus: '실행 상태',
      execResult: '실행 결과',
      rollback: '롤백 문장',
      rollbackTips: '안내만 제공하며 롤백 실행은 지원하지 않습니다',
      describe: '설명',
      analyze: '분석',
      addDescribe: '설명 추가',
      createWhitelist: 'SQL 관리 화이트리스트에 추가'
    },

    filterForm: {
      highestAuditLevel: '최고 감사 경고 레벨'
    },

    sqlFileSource: {
      tips: '현재 SQL/ZIP 파일의 SQL 소스 보기만 지원합니다',
      source: '소스 파일',
      fileLine: '줄 번호'
    },

    auditStatus: {
      initialized: '감사 준비 완료',
      doing: '감사 중',
      finished: '감사 완료'
    },
    copyExecSql: '실행 문장 복사',
    auditSuccess: '감사 통과',

    fileModeExecute: {
      headerTitle: '파일 정보 개요',
      sqlsTips: '처음 5개 데이터 항목만 표시됩니다, <0>더 보기<0>',
      extraButtonText: '실행 워크플로우 편집',

      sortableSQLFilesModal: {
        title: '실행 워크플로우 편집',
        tips: '테이블의 행을 드래그하여 SQL 파일의 실행 워크플로우 순서를 변경하세요.',
        resetFileOrder: '파일 워크플로우 재설정',
        tableColumns: {
          execOrder: '초기 실행 번호',
          index: '정렬 후 실행 번호',
          fileName: '파일',
          hasDragged: '워크플로우 변경 여부'
        },
        successTips: '정렬 성공!'
      }
    },

    fileModeSqls: {
      backToDetail: '워크플로우 상세로 돌아가기',
      title: '파일 정보 상세',

      statistics: {
        audit: '감사 결과 정보',
        execute: '실행 결과 정보'
      }
    }
  },

  common: {
    workflowStatus: {
      process: '처리 중',
      canceled: '종료됨',
      executing: '실행 중',
      execFailed: '실행 실패',
      waitForAudit: '감사 대기 중',
      waitForExecution: '실행 대기 중',
      reject: '거부됨',
      execScheduled: '예약 실행',
      execSucceeded: '실행 성공',
      manuallyExecuted: '수동 실행',
      terminateFailed: '종료 실패',
      terminateSucceeded: '종료 성공',
      terminating: '종료 중'
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
    }
  }
};
