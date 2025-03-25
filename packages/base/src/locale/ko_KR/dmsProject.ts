// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '프로젝트 관리',
  pageDesc:
    '프로젝트 차원에서 DMS 플랫폼 리소스와 기능을 구성하고 관리하며, 프로젝트 진입점을 통해 다양한 감사 기능을 지원하고, 서로 다른 프로젝트 간에 리소스를 격리합니다.',
  projectList: {
    title: '프로젝트 목록',
    deleteSuccessTips: '프로젝트 "{{name}}" 삭제 성공',
    archiveProjectSuccessTips: '프로젝트 "{{name}}" 보관 성공',
    unarchiveProjectSuccessTips: '프로젝트 "{{name}}" 보관 해제 성공',
    exportMessage: '프로젝트 내보내는 중',
    columns: {
      status: '프로젝트 상태',
      available: '사용 가능',
      unavailable: '사용 불가',
      createTime: '생성 시간',
      createUser: '생성자',
      deleteProjectTips: '프로젝트 "{{name}}"을(를) 삭제하시겠습니까?',
      archive: '보관',
      unarchive: '보관 해제',
      archiveProjectTips: '프로젝트 "{{name}}"을(를) 보관하시겠습니까?',
      unarchiveProjectTips: '프로젝트 "{{name}}"의 보관을 해제하시겠습니까?'
    }
  },
  projectForm: {
    name: '프로젝트 이름',
    desc: '프로젝트 설명',
    business: '사용 가능한 비즈니스',
    addBusiness: '비즈니스 추가',
    deleteTip: '현재 비즈니스는 이미 리소스와 연결되어 있어 삭제할 수 없습니다',
    fixedBusiness: '선택 가능한 비즈니스 태그 고정',
    fixedBusinessExtra:
      '활성화하면 프로젝트에서 사용 가능한 비즈니스 태그가 고정되며 관리자만 관리할 수 있습니다',
    businessName: '비즈니스 이름'
  },
  createProject: {
    modalTitle: '프로젝트 생성',
    createSuccessTips: '프로젝트 {{name}} 생성 성공'
  },
  updateProject: {
    modalTitle: '프로젝트 편집',
    updateSuccessTips: '프로젝트 {{name}} 업데이트 성공'
  },
  detail: {
    modalTitle: '프로젝트 선택',
    modalTips: '최근에 열린 프로젝트가 없습니다. 프로젝트를 선택해 주세요!',
    projectSelectorDropdownSlot: '프로젝트 목록'
  },
  exportProject: {
    buttonText: '내보내기'
  },
  importProject: {
    buttonText: '가져오기',
    title: '프로젝트 및 비즈니스 가져오기',
    selectFile: '가져올 파일 선택',
    submitText: '가져오기',
    fileRequireTips: '선택된 파일 없음',
    successTitle: '프로젝트 및 비즈니스 가져오기 성공',
    successTips: '프로젝트 목록으로 이동하여 가져온 프로젝트 보기',
    importingFile: '파일 가져오는 중...',
    downloadTemplate: '가져오기 템플릿 다운로드',
    table: {
      project: '프로젝트',
      desc: '설명',
      business: '비즈니스'
    }
  },
  batchImportDataSource: {
    buttonText: 'DB 인스턴스 일괄 가져오기',
    title: 'DB 인스턴스 일괄 가져오기',
    successTitle: 'DB 인스턴스 일괄 가져오기 성공',
    checkSuccess: '유효성 검사 통과',
    testConnectLabel: 'DB 인스턴스 연결성 테스트',
    testConnect: 'DB 인스턴스 연결성 일괄 테스트',
    testConnectSuccess: '연결성 테스트 성공 {{count}}개',
    testConnectFail:
      '연결성 테스트 실패 {{count}}개, DB 인스턴스는 {{name}}입니다',
    requestAuditErrorMessage:
      '현재 가져온 정보에 유효성 검사 실패가 있습니다. 다운로드된 파일의 힌트에 따라 수정하고 다시 가져오세요'
  },
  backToList: '프로젝트 목록으로 돌아가기',
  businessDescription: {
    title:
      '우리 플랫폼은 프로젝트-비즈니스-데이터 소스의 계층 구조를 사용하여 명확하고 질서 있는 데이터 리소스 관리 방법을 제공합니다.',
    project:
      '프로젝트: 각 프로젝트는 독립적인 제품 환경을 나타내며, 데이터 보안과 제품 독립성을 보장하기 위한 리소스 격리 단위 역할을 합니다. 프로젝트 수준에서 관련 비즈니스 모듈을 집계하고 관리할 수 있습니다.',
    business:
      '비즈니스: 프로젝트를 기반으로 비즈니스는 특정 비즈니스 도메인의 하위 프로젝트 또는 태그 역할을 하여 데이터 리소스를 더욱 구성하고 세분화하는 데 도움이 됩니다. 비즈니스 계층을 통해 특정 요구 사항에 대한 데이터를 중앙에서 관리하고 운영할 수 있습니다.',
    dataSource:
      '데이터 소스: 데이터 소스는 비즈니스를 기반으로 구축된 실제 작업 객체입니다. 데이터 소스 수준에서 쿼리, 업데이트, 데이터 관리와 같은 특정 데이터 작업을 수행할 수 있습니다.'
  }
};
