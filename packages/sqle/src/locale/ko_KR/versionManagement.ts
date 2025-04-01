// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '버전 관리',
  ceTips:
    '협업 데이터베이스 개발에서 버전 관리를 통해 SQL 변경 사항을 쉽게 추적하고 제어할 수 있으며, 개발에서 프로덕션까지 전체 프로세스를 모니터링하고 배포 진행 상황을 추적하여 데이터베이스 변경이 안전하고 제어 가능하도록 보장합니다.',
  operation: {
    add: '버전 추가',
    backToListPage: '버전 목록으로 돌아가기'
  },
  list: {
    column: {
      name: '버전 이름',
      desc: '버전 설명',
      status: '버전 상태',
      createTime: '생성 시간',
      lockTime: '잠금 시간'
    },
    action: {
      lock: '잠금',
      lockConfirm:
        '잠금 후에는 버전 내용을 변경할 수 없습니다. 잠금을 확인하시겠습니까?',
      deleteConfirm:
        '버전 레코드를 삭제하면 작업 주문에서 버전 태그가 제거됩니다. 삭제를 확인하시겠습니까?',
      locking: '버전 잠금 중...',
      lockSuccessTip: '버전이 성공적으로 잠겼습니다',
      deleting: '버전 삭제 중...',
      deleteSuccessTip: '버전이 성공적으로 삭제되었습니다'
    },
    locked: '잠김',
    releasing: '릴리스 중'
  },
  create: {
    title: '버전 생성',
    successTips: '버전이 성공적으로 생성되었습니다',
    viewVersionDetail: '버전 세부 정보 보기',
    continueText: '버전 생성 계속하기'
  },
  update: {
    title: '버전 업데이트',
    successTips: '버전이 성공적으로 업데이트되었습니다'
  },
  form: {
    baseInfo: '버전 기본 정보',
    name: '버전 이름',
    nameTip:
      '이 배포를 위한 식별 가능한 버전 이름을 입력하세요. 예: SQLE2_2409_0',
    desc: '버전 설명',
    descTip: '이 배포의 목적을 설명하고 버전 변경 범위를 표시하세요',
    deploymentStageConf: '단계 구성',
    addStage: '단계 추가',
    stageName: '단계 이름',
    instance: '데이터 소스',
    dev: '개발',
    test: '테스트',
    prod: '프로덕션'
  },
  detail: {
    backToVersionDetail: '버전 세부 정보로 돌아가기',
    deploy: '배포',
    execute: '실행'
  },
  release: {
    title: '일괄 배포 작업 주문',
    disableTips:
      '작업 주문은 순차적으로 배포되어야 하며, 다음 단계 데이터 소스에 대한 작업 주문을 생성할 권한이 있어야 합니다. 현재 작업 주문 순서가 성공적으로 온라인 상태인지 확인하고 권한을 확인하세요.',
    currentAllowReleaseWorkflow:
      '작업 주문은 순차적으로 배포됩니다. 다음 작업 주문은 현재 단계의 배포 조건을 충족합니다',
    targetDataSource: '대상 데이터 소스',
    currentDataSource: '현재 데이터 소스',
    schemaPlaceholder: '데이터베이스를 선택하세요 (선택 사항)',
    successTips: '작업 주문 일괄 배포 성공'
  },
  execute: {
    title: '일괄 실행 작업 주문',
    disableTips:
      '작업 주문은 순차적으로 실행됩니다. 실행 작업을 시도하기 전에 다음 작업 주문이 실행 조건을 충족하는지 확인하세요.',
    currentAllowExecuteWorkflow:
      '작업 주문은 순차적으로 실행됩니다. 다음 작업 주문은 현재 단계의 실행 조건을 충족합니다. 실행을 확인하시겠습니까?',
    successTips: '작업 주문 일괄 실행 성공'
  },
  stageNode: {
    workflowDesc: '작업 주문 설명',
    executeTime: '실행 시간',
    retry: '재시도',
    offlineExecuted: '오프라인으로 실행됨',
    addExistingWorkflow: '기존 작업 주문 추가',
    createWorkflow: '새 작업 주문 생성'
  },
  associateWorkflow: {
    title: '기존 작업 주문 연결',
    workflow: '작업 주문',
    workflowName: '작업 주문 이름',
    workflowDesc: '작업 주문 설명',
    workflowStatus: '작업 주문 상태',
    successTips: '작업 주문이 성공적으로 연결되었습니다'
  },
  offlineExec: {
    title: '오프라인 실행',
    remarks: '비고',
    successTips: '오프라인 실행 성공'
  }
};
