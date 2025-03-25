// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '규칙 보기',
  pageDesc:
    '여기에서 모든 감사 규칙을 보거나 특정 규칙 템플릿에 대해 활성화된 모든 감사 규칙을 볼 수 있습니다',
  notProjectRuleTemplate: '현재 프로젝트에 대한 규칙 템플릿이 없습니다',
  createRuleTemplateTips1: '다음으로 이동하세요',
  createRuleTemplate: '규칙 템플릿 생성',
  createRuleTemplateTips2: '데이터를 추가할 페이지',
  allRules: '모든 규칙',
  templateRuleList: '템플릿 규칙 목록',
  activeRules: '템플릿 {{name}}에 대해 활성화된 규칙',
  disableRules: '템플릿 {{name}}에 대해 비활성화된 규칙',
  globalRuleTemplate: '전역 규칙 템플릿',
  projectRuleTemplate: '프로젝트 규칙 템플릿',
  form: {
    project: '프로젝트',
    ruleTemplate: '규칙 템플릿',
    dbType: 'DB 유형',
    ruleTemplateTips:
      '프로젝트를 선택하지 않으면 현재 규칙 템플릿은 전역 규칙 템플릿이고, 선택 후에는 프로젝트 아래의 규칙 템플릿입니다',
    fuzzy_text_placeholder: '검색할 규칙 키워드를 입력하세요'
  },
  ruleLevelIcon: {
    normal: '정상',
    notice: '알림',
    warn: '경고',
    error: '오류',
    toolTipsTitle: '경고 수준: {{ruleLevel}}({{text}})'
  },
  ruleDetail: {
    title: '규칙 보기',
    knowledge: '규칙 지식 베이스'
  }
};
