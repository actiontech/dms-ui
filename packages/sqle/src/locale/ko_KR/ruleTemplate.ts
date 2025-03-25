// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '감사 규칙 템플릿',
  pageDescribe: 'SQL 감사는 DB 인스턴스에 바인딩된 규칙 템플릿을 적용합니다',

  ruleTemplateListTitle: '프로젝트 규칙 템플릿 목록',
  globalRuleTemplateListTitle: '공용 규칙 템플릿 목록',
  ruleTemplateTitle: {
    project: '프로젝트 규칙 템플릿',
    common: '공용 규칙 템플릿'
  },

  backToList: '규칙 템플릿 목록으로 돌아가기',

  ruleTemplateList: {
    descEmpty: '없음',

    instance: '적용된 데이터베이스',
    instanceEmpty: '바인딩된 DB 인스턴스 없음',

    clone: '복제',
    export: '내보내기',

    table: {
      templateName: '템플릿 이름',
      desc: '설명',
      dbType: '적용 가능한 데이터베이스 유형',
      dataSource: '바인딩된 DB 인스턴스'
    }
  },

  detail: {
    project: '프로젝트',
    dbType: 'DB 인스턴스 유형',
    error: '규칙 세부 정보 가져오기 오류',
    auditCapability: '감사 능력',
    rewriteCapability: '재작성 능력'
  },

  deleteRuleTemplate: {
    tips: '규칙 템플릿 "{{name}}"을(를) 삭제하시겠습니까?',
    deleting: '템플릿 "{{name}}" 삭제 중...',
    deleteSuccessTips: '템플릿 "{{name}}" 삭제 성공'
  },

  ruleTemplateForm: {
    placeholder: {
      templateDesc: '템플릿 설명 추가하려면 클릭'
    },
    baseInfoTitle: '기본 정보',
    baseInfoDesc: '템플릿 이름 및 설명과 같은 기본 정보 설정',

    ruleTitle: '규칙',
    ruleDesc: '활성화할 규칙 선택',

    result: '결과',
    resultDesc: '결과 변경',

    templateName: '템플릿 이름',
    templateDesc: '템플릿 설명',
    databaseType: '데이터베이스 유형',

    activeRuleTitle: '활성화된 규칙',
    activeRule: '이 규칙 활성화',
    activeAllRules: '모든 규칙 활성화',
    disableRuleTitle: '비활성화된 규칙',
    disableAllRules: '모든 규칙 비활성화',
    disableRule: '이 규칙 비활성화',
    editRule: '이 규칙 편집',

    emptyRule: '일치하는 규칙을 찾을 수 없음',
    ruleValue: '규칙 값',

    activeAnchorTitle: '활성화됨',
    disableAnchorTitle: '비활성화됨'
  },

  createRuleTemplate: {
    button: '규칙 템플릿 생성',
    title: '감사 규칙 템플릿 생성',
    successTitle: '감사 규칙 템플릿 생성 성공',
    createNew: '다른 새 감사 규칙 템플릿 생성 >', // 삭제
    reCreateNew: '다른 새 감사 규칙 템플릿 생성'
  },

  importRuleTemplate: {
    button: '규칙 템플릿 가져오기',
    title: '감사 규칙 템플릿 가져오기',
    selectFile: '가져올 파일 선택',
    selectFileTips:
      '기존 플랫폼 규칙 가져오기만 지원합니다. 규칙 임계값을 수정하거나 불필요한 규칙을 삭제할 수 있습니다.',
    submitText: '가져오기',
    fileRequireTips: '선택된 파일 없음',
    successTitle: '감사 규칙 템플릿 가져오기 성공',
    importNew: '다른 새 감사 규칙 템플릿 가져오기 >',
    importingFile: '파일 가져오는 중...',
    parseFileFailed:
      '현재 가져온 정보에 유효성 검사 실패가 있습니다. 다운로드된 파일의 프롬프트에 따라 수정하고 다시 가져오세요.',
    dbType: '데이터 소스 유형',
    fileType: '파일 유형',
    downloadTemplate: '가져오기 템플릿 다운로드',
    downloading: '템플릿 파일 다운로드 중...',
    checkSuccess: '유효성 검사 통과'
  },

  exportRuleTemplate: {
    button: '규칙 템플릿 내보내기',
    exporting: '템플릿 "{{name}}" 내보내는 중...',
    modal: {
      title: '감사 규칙 템플릿 내보내기',
      submit: '내보내기',
      exportFileType: '내보내기 파일 유형'
    }
  },

  updateRuleTemplate: {
    title: '감사 규칙 템플릿 업데이트',
    successTitle: '감사 규칙 템플릿 ({{name}}) 업데이트 성공'
  },

  editModal: {
    title: '규칙 편집',
    ruleLevelLabel: '규칙 수준',
    ruleLevelValue: '사전 설정 값',
    ruleLevelLabelPlace: '규칙에 해당하는 수준 선택',
    ruleLevelValuePlace: '규칙의 기본값을 입력해 주세요',

    ruleDescLabel: '규칙 설명',
    ruleTypeLabel: '규칙 카테고리',
    ruleNameLabel: '규칙 이름',
    ruleDbType: '데이터베이스 유형',
    rule: '규칙',
    annotation: '설명',
    ruleValueTypeOnlyNumber: '현재 규칙 값 유형은 숫자만 가능합니다'
  },

  cloneRuleTemplate: {
    button: '규칙 템플릿 복제',
    title: '규칙 템플릿 복제',
    cloneDesc:
      '복제된 규칙 템플릿은 소스 템플릿의 모든 활성화된 규칙과 변경된 규칙 수준 및 임계값만 상속합니다. 복제된 새 규칙 템플릿의 기본 정보(예: 템플릿 이름)는 수동으로 입력해야 합니다.',
    currentTemplateTips: '감사 규칙 템플릿 복제 중',
    successTips: '규칙 템플릿 "{{name}}" 복제 성공'
  },

  ruleLevel: {
    normal: '정상',
    error: '오류',
    warn: '경고',
    notice: '알림',
    unknown: '알 수 없음'
  }
};
