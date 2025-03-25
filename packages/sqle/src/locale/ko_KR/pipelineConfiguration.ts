// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: 'CI/CD 파이프라인 구성',
  createPipeline: '파이프라인 생성',

  defaultPrompt: {
    promptTitle: '구성된 파이프라인 없음',
    promptDesc:
      '파이프라인을 구성하면 플랫폼의 검토 및 실행 기능을 CI/CD 프로세스에 통합하여 SQL 품질 감독을 자동화할 수 있습니다.',
    promptStep:
      '파이프라인 생성\n파이프라인 통합 지침 받기\nCI/CD에서 구성 및 실행\n실행 결과 및 검토 수신'
  },

  table: {
    name: '파이프라인 이름',
    desc: '파이프라인 설명',
    address: '연결된 파이프라인 URL',
    nodeCount: '노드 수',
    confirmDelete: '이 파이프라인을 삭제하시겠습니까?',
    deleting: '파이프라인 삭제 중...',
    deleteSuccess: '파이프라인이 성공적으로 삭제되었습니다'
  },

  create: {
    backToPipelineList: '파이프라인 목록으로 돌아가기',
    title: '파이프라인 생성',
    successTips: '파이프라인이 성공적으로 생성되었습니다',
    successSubTips:
      '이제 통합 지침에 따라 CI/CD 파이프라인을 구성하여 검토/배포 결과를 얻을 수 있습니다.',
    successButtonText: '파이프라인 통합 지침 받기'
  },
  update: {
    title: '파이프라인 업데이트',
    successTips: '파이프라인이 성공적으로 업데이트되었습니다'
  },
  form: {
    baseConfig: '기본 정보',
    name: '파이프라인 이름',
    nameTip:
      'CI/CD 플랫폼에서 생성된 파이프라인 이름 또는 이해하고 연결하기 쉬운 다른 이름을 입력하세요.',
    desc: '파이프라인 설명',
    descTip: '이 파이프라인의 목적과 기대사항에 관련된 정보를 입력하세요.',
    address: '파이프라인 URL',
    addressTip:
      'CI/CD 플랫폼에서 생성된 파이프라인 프로젝트 URL(예: http(s)://ip:port/job/jobname/)을 제공하여 연결을 용이하게 하세요. 파이프라인을 아직 생성하지 않았다면 나중에 추가할 수 있습니다.',
    nodeConfig: '노드 구성',
    node: {
      emptyTips: '추가된 파이프라인 노드 없음',
      name: '노드 이름',
      duplicateName: '노드 이름은 고유해야 합니다',
      type: '노드 유형',
      auditObjectType: '감사 대상 유형',
      auditObjectTypeTips: '현재 SQL 파일 및 MyBatis 파일 감사를 지원합니다.',
      auditObjectTypeDictionary: {
        sql: 'SQL 파일',
        mybatis: 'MyBatis 파일'
      },
      auditObjectPath: '감사 대상 경로',
      auditObjectPathTips:
        '감사할 SQL 객체의 경로를 입력하여 플랫폼이 SQL 수집 명령을 생성하도록 도와주세요. 이 명령은 CI/CD 플랫폼 구성에 사용됩니다. 파일의 절대 경로(예: /opt/sqle/std.log) 또는 파일이 위치한 디렉토리 경로(예: /opt/sqle/)를 입력해야 합니다.',
      auditMethod: '감사 방법',
      auditMethodTips:
        '데이터 소스와 결합된 감사 결과를 얻어야 하는 경우 온라인 감사를 선택하고, SQL 자체의 구문 감사만 필요한 경우 오프라인 감사를 선택하세요.',
      auditMethodDictionary: {
        offline: '오프라인 감사',
        online: '온라인 감사'
      },
      instance: '데이터 소스',
      instanceTips:
        '데이터 소스를 선택하세요. 플랫폼은 데이터 소스를 기반으로 감사 결과를 제공합니다.',
      template: '감사 규칙 템플릿',
      templateTips:
        'SQL을 감사할 때 플랫폼이 적용할 감사 규칙 템플릿을 선택하세요.',
      typeDictionary: {
        audit: '감사',
        release: '배포'
      },
      removeConfirmTips: '이 파이프라인 노드를 삭제하시겠습니까?',
      addNode: '노드 추가',
      modal: {
        createTitle: '노드 생성',
        editTitle: '노드 편집'
      }
    }
  },

  modal: {
    title: '파이프라인 세부 정보',
    pipelineNode: '파이프라인 노드',
    integrationInfo: '통합 지침',
    view: '보기',
    viewIntegrationInfo: '통합 지침 보기'
  }
};
