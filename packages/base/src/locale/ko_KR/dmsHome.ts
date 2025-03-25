// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '사용자 가이드',
  defaultScene: {
    header: {
      adminUser: '관리자 사용자',
      normalUser: '일반 사용자'
    },
    steps: {
      databaseTarget: {
        title: 'DB 인스턴스',
        innerContents: {
          title_0: 'DB 인스턴스',
          content_0: 'DB 인스턴스 관련 작업 관리',
          action_0_0: '목록 보기',
          action_0_1: 'DB 인스턴스 추가',
          title_1: '외부 DB 인스턴스',
          content_1: '외부 DB 인스턴스 관련 작업 관리',
          action_1_0: '목록 보기',
          action_1_1: '동기화 작업 생성'
        }
      },
      memberAndPermission: {
        title: '멤버',
        innerContents: {
          title_0: '멤버',
          content_0:
            '프로젝트에 멤버/멤버 그룹을 추가하고 해당 DB 인스턴스 작업 권한 구성',
          action_0_0: '멤버 보기'
        }
      },
      safetyRule: {
        title: '데이터 보안 규칙 관리',
        innerContents: {
          title_0: '감사 관리',
          content_0:
            '플랫폼에서 지원하는 감사 규칙 보기, 감사 규칙 템플릿 사용자 정의, 생성된 SQL 모니터링 또는 SQL 감사를 사용하여 SQL 품질 향상',
          action_0_0: '감사 규칙 보기',
          action_0_1: '규칙 템플릿 보기',
          action_0_2: 'SQL 관리 구성 보기',
          action_0_3: '새 SQL 감사 생성',
          title_1: 'DB 인스턴스 권한 부여 관리',
          content_1:
            '데이터 권한 템플릿을 구성하고 지정된 사용자에게 권한 부여',
          action_1_0: '권한 템플릿',
          action_1_1: '권한 부여 목록',
          title_2: '승인 프로세스',
          content_2: '실제 비즈니스 흐름에 따라 프로세스 템플릿 변경',
          action_2_0: '승인 프로세스 템플릿 구성',
          action_2_1: '승인 프로세스 템플릿 보기'
        }
      },
      queryAndModify: {
        title: '데이터 쿼리 및 수정',
        innerContents: {
          title_0: 'SQL 창',
          content_0:
            '온라인 데이터 편집기(CloudBeaver)를 사용하여 SQL 쿼리 및 편집',
          action_0_0: 'SQL 워크벤치 입장',
          title_1: '데이터 수정',
          content_1:
            '온라인으로 SQL 수정 요청 제출, 승인 프로세스를 통해 온라인 프로세스 완료',
          action_1_0: 'SQL 티켓 제출',
          action_1_1: '권한 부여 티켓 제출',
          title_2: '데이터 내보내기',
          content_2: '데이터 내보내기 티켓을 제출하고 승인 후 데이터 세트 획득',
          action_2_0: '내보내기 티켓 제출'
        }
      },
      devopsAndAudit: {
        title: '운영 및 로그',
        innerContents: {
          title_0: '순찰 및 진단',
          content_0:
            'DB 인스턴스에 대해 주기적 또는 수동 순찰을 수행하고 비정상적인 문제를 지능적으로 진단할 수 있습니다',
          title_1: '운영 로그',
          content_1: '플랫폼 내 사용자 작업 감사',
          action_1_0: '권한 부여 감사',
          action_1_1: '권한 템플릿 감사',
          action_1_2: 'DB 인스턴스 작업 감사',
          action_1_3: 'SQLE 작업 기록'
        }
      }
    }
  }
};
