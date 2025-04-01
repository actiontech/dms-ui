/* eslint-disable import/no-anonymous-default-export */
export default {
  title: '사용자 정의 규칙',
  ceTips:
    '사용자가 비즈니스 요구 사항에 따라 감사 규칙을 생성해야 할 때, 플랫폼의 사용자 정의 규칙 기능을 사용할 수 있으며, 이는 플랫폼을 통해 빠르게 개발되어 사용자의 규칙 개발 진입 장벽을 낮출 수 있습니다',
  backToList: '사용자 정의 규칙 목록으로 돌아가기',

  filterForm: {
    databaseType: 'DB 인스턴스 유형',
    ruleName: '규칙 이름',
    add: '생성'
  },

  editRule: '이 규칙 편집',
  deleteRule: '이 규칙 삭제',
  deleteSuccessTips: '규칙 {{desc}}이(가) 성공적으로 삭제되었습니다',
  deleteConfirm: '이 규칙을 삭제하시겠습니까?',

  addCustomRule: {
    title: '사용자 정의 감사 규칙 생성',
    successTitle: '제출 성공',
    backToList: '생성된 사용자 정의 규칙 보기',
    successTips:
      '생성된 사용자 정의 규칙을 적용하려면, 규칙 템플릿에서 해당 규칙을 적시에 활성화하세요'
  },

  editCustomRule: {
    title: '사용자 정의 감사 규칙 편집',
    successTitle: '제출 성공',
    backToList: '생성된 사용자 정의 규칙 보기'
  },

  customRuleForm: {
    baseInfoTitle: '기본 정보',
    baseInfoDesc: '기본 규칙 정보 입력',

    editRuleTitle: '규칙 작성',
    editRuleDesc: '규칙 스크립트 입력',

    submit: '제출',
    submitCustomRule: '사용자 정의 규칙 제출'
  },

  baseInfoForm: {
    ruleID: '규칙 ID',
    ruleName: '규칙 이름',
    ruleDesc: '규칙 설명',
    dbType: '적용 가능한 DB 인스턴스 유형',
    ruleType: '규칙 분류',
    level: '기본 경고 수준',
    addExtraRuleType: '규칙 분류 추가',
    addExtraRuleTypePlaceholder: '추가하려는 규칙 분류의 이름을 입력하세요'
  },

  editScriptForm: {
    inputRuleScript: '규칙 스크립트',
    placeholder: '여기에 정규 표현식을 입력하세요'
  }
};
