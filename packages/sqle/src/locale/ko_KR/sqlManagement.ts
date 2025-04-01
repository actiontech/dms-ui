// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'SQL 관리',
  pageHeader: {
    action: {
      export: '내보내기',
      exporting: '파일 내보내는 중',
      exportSuccessTips: '파일 내보내기 성공'
    }
  },
  statistics: {
    SQLTotalNum: 'SQL 총계',
    problemSQlNum: '문제 SQL',
    optimizedSQLNum: '최적화된 SQL'
  },
  ceTips:
    'SQL 관리는 사용자에게 전체 수명 주기 모니터링을 제공합니다. 이 패널은 모든 비즈니스 SQL을 통합하여 사용자가 프로젝트에서 수집 및 감사된 모든 SQL을 볼 수 있고, 문제가 있는 SQL을 노출하며, 사용자가 이를 해결할 수 있도록 지원합니다.',
  table: {
    action: {
      batch: {
        assignment: '일괄 할당',
        assignmentSuccessTips: '담당자를 일괄적으로 성공적으로 할당했습니다',
        solve: '일괄 해결',
        solveTips: '선택한 SQL을 해결됨으로 설정하시겠습니까?',
        solveSuccessTips: 'SQL을 일괄적으로 성공적으로 해결했습니다',
        ignore: '일괄 무시',
        ignoreTips: '선택한 SQL을 무시됨으로 설정하시겠습니까?',
        ignoreSuccessTips: 'SQL을 일괄적으로 성공적으로 무시했습니다'
      },
      single: {
        assignment: '담당자 할당',
        assignmentSuccessTips: '담당자를 성공적으로 할당했습니다',
        updatePriority: {
          triggerText: '우선순위 변경',
          successTips: 'SQL 우선순위를 성공적으로 변경했습니다',
          label: '우선순위 변경',
          high: '높은 우선순위',
          low: '낮은 우선순위'
        },
        updateStatus: {
          triggerText: '상태 변경',
          label: '현재 SQL 상태',
          solve: '해결',
          ignore: '무시',
          manualAudit: '수동 감사',
          signalUpdateStatusSuccessTips:
            'SQL 상태를 성공적으로 업데이트했습니다'
        }
      },
      analyze: '분석',
      createSqlManagementException: 'SQL 관리 화이트리스트에 추가',
      createWhitelist: '감사 화이트리스트에 추가'
    },
    column: {
      SQLFingerprint: 'SQL 지문',
      source: '소스',
      instanceName: 'DB 인스턴스',
      priority: '우선순위',
      highPriority: '높은 우선순위',
      lowPriority: '낮은 우선순위',
      auditResult: '감사 결과',
      firstOccurrence: '첫 발생 시간',
      lastOccurrence: '마지막 발생 시간',
      occurrenceCount: '발생 횟수',
      personInCharge: '담당자',
      status: '상태',
      comment: '코멘트',
      endpoints: '엔드포인트 정보'
    },
    filter: {
      time: '시간 범위',
      status: {
        unhandled: '미처리',
        solved: '해결됨',
        ignored: '무시됨',
        manual_audited: '수동 감사됨'
      },
      business: '비즈니스',
      instanceName: 'DB 인스턴스',
      source: {
        label: '소스',
        auditPlan: '스캔 작업',
        defaultAuditPlan: '스캔 작업 기본 유형',
        apiAudit: 'SQL 감사'
      },
      auditLevel: {
        label: '최소 감사 수준',
        normal: '정상',
        error: '오류',
        warn: '경고',
        notice: '알림'
      },
      assignee: '나와 관련됨',
      viewHighPrioritySql: '높은 우선순위 SQL 보기',
      rule: '감사 규칙'
    },
    statusReport: {
      title: 'SQL 감사 결과'
    }
  }
};
