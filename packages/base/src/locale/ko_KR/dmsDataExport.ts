// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '데이터 내보내기',
  ceTips:
    '특정 DB 인스턴스를 볼 수 있는 권한이 없지만 해당 인스턴스에서 데이터를 내보내야 할 때, 데이터 내보내기 기능을 사용할 수 있습니다. 승인 프로세스를 거쳐 해당 데이터를 얻을 수 있습니다. 이렇게 하면 직접적인 조회 권한이 없어도 필요한 데이터를 얻을 수 있습니다.',
  status: {
    wait_for_audit: '감사 대기 중',
    wait_for_export: '내보내기 대기 중',
    finished: '내보내기 성공',
    exporting: '내보내기 중',
    export_failed: '내보내기 실패',
    expired: '만료됨',
    rejected: '거부됨',
    canceled: '종료됨',
    file_deleted: '제거됨'
  },
  batchCancel: {
    messageWarn:
      '선택한 작업에 종료할 수 없는 작업이 포함되어 있습니다! ("{{waitAudit}}" 및 "{{reject}}" 상태의 작업만 종료할 수 있습니다.)'
  },
  create: {
    backToList: '작업 목록으로 돌아가기',
    button: '내보내기 생성',
    form: {
      base: {
        title: '내보내기 작업 생성',
        name: '데이터 내보내기 작업 이름',
        describe: '작업 설명',
        describePlaceholder: '데이터 내보내기 설명을 추가하려면 클릭하세요'
      },
      source: {
        title: '내보내기 대상 선택',
        business: '비즈니스 유형',
        dbService: 'DB 인스턴스',
        schema: '데이터베이스'
      },
      method: {
        title: '내보내기 방법 선택',
        manualInput: 'SQL 문 입력'
      },
      action: {
        audit: '감사',
        format: 'SQL 미화',
        formatTips:
          '현재 SQL 미화를 지원하는 데이터베이스 유형은 {{supportType}}입니다. DB 인스턴스를 선택하지 않았거나 선택한 DB 인스턴스 유형이 아직 지원되지 않는 경우, SQL 미화로 인해 SQL 문에 구문 오류가 발생할 수 있습니다.'
      }
    },
    update: {
      baseTitle: '작업 기본 정보',
      sourceTitle: '작업 내보내기 대상',
      methodTitle: '내보내기 방법',
      updateInfoAction: '작업 수정',
      submitAction: '작업 제출',
      submitTips: 'DQL 문에 대한 내보내기 작업 생성만 지원합니다'
    },
    result: {
      success: '작업이 성공적으로 생성되었습니다',
      guide: '새로 생성된 작업 보기'
    }
  },
  batchClose: {
    button: '일괄 종료',
    tips: '선택한 내보내기 작업을 종료하시겠습니까?'
  },
  list: {
    column: {
      id: '작업 ID',
      name: '작업 이름',
      dbService: 'DB 인스턴스',
      desc: '설명',
      exportMethod: '내보내기 방법',
      createUser: '생성자',
      createTime: '생성 시간',
      exportTime: '내보내기 시간',
      status: '상태',
      assignee: '담당자',
      viewOrderDetail: '작업 세부 정보 보기'
    },
    actions: {
      closed: '종료',
      closeTips: '작업 "{{name}}"을(를) 종료하시겠습니까?'
    }
  },
  detail: {
    reject: {
      reason: '{{name}}이(가) 현재 작업을 거부했습니다. 이유는:',
      tips: '작업이 거부되면 작업 생성자가 수정하고 검토를 위해 다시 제출해야 합니다. (현재 작업 수정은 지원되지 않습니다.)'
    },
    exportResult: {
      title: '내보내기 결과',
      overview: {
        title: '개요',
        column: {
          dbService: 'DB 인스턴스',
          status: '상태',
          assigneeUser: '담당자',
          exportStartTime: '내보내기 시작 시간',
          exportEndTime: '내보내기 종료 시간',
          exportType: '내보내기 방법',
          exportFileType: '내보내기 파일 유형',
          action: {
            download: '데이터 다운로드',
            downloadTips:
              '24시간 이내에 데이터셋을 다운로드하세요. 만료되면 작업을 다시 제출해야 합니다.'
          }
        }
      },
      taskDetail: {
        copy: 'SQL 문 복사',
        exportContent: '내보내기 내용',
        exportFileType: '내보내기 형식',
        auditResult: '감사 결과',
        exportResult: '내보내기 결과',
        downloadSQL: 'SQL 문 다운로드'
      }
    },
    record: {
      title: '작업 정보',
      basicInfo: {
        title: '기본 정보',
        createUser: '생성자',
        createTime: '생성 시간',
        status: '상태'
      },
      steps: {
        title: '작업 진행 상황',
        create: '작업 생성',
        update: '작업 업데이트',
        approve: '작업 감사',
        execute: '내보내기 실행'
      },
      history: {
        title: '작업 작업 기록'
      }
    },
    action: {
      workflowDetail: '작업 세부 정보',
      close: {
        text: '작업 종료',
        successTips: '작업이 성공적으로 종료되었습니다!'
      },
      approve: {
        text: '승인',
        successTips: '작업이 성공적으로 승인되었습니다!'
      },
      reject: {
        modal: {
          title: '거부',
          text: '거부'
        },
        reason: '거부 이유',
        text: '감사 거부',
        tips: '현재 작업은 내보내기 작업 아래의 모든 내보내기 작업을 거부합니다. 신중하게 작업하세요!',
        successTips: '작업이 성공적으로 거부되었습니다!'
      },
      execute: {
        text: '내보내기 실행',
        successTips: '작업이 성공적으로 실행되었습니다!',
        confirmTips:
          '현재 작업은 내보내기 작업 아래의 모든 작업을 즉시 실행합니다. 즉시 내보내기를 실행하시겠습니까?'
      }
    },
    operator: {
      unknown: '알 수 없는 단계',
      waitAudit: '감사자 작업 대기 중',
      alreadyRejected: '작업이 거부되었습니다',
      alreadyClosed: '작업이 종료되었습니다'
    }
  },
  common: {
    auditResult: {
      column: {
        number: '번호',
        execSql: '실행 문',
        sqlType: '문 유형',
        auditResult: '감사 결과',
        createWhitelist: '감사 화이트리스트에 추가'
      }
    }
  }
};
