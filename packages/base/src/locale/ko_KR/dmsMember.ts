// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '멤버',
  pageDesc: '멤버에서 멤버를 추가하고 멤버 권한을 구성할 수 있습니다',
  memberList: {
    title: '멤버 목록',
    deleteConfirmTitle: '멤버 {{name}}을(를) 삭제하시겠습니까?',
    deleteSuccessTips: '멤버 {{name}}이(가) 성공적으로 삭제되었습니다',
    columns: {
      opRanges: '플랫폼 작업 권한',
      opRangeTips: '형식 역할: [작업 범위 11, 작업 범위 2 ...]',
      isProjectAdmin: '프로젝트 관리자'
    },
    allPermission: '전체: 모든 DB 인스턴스에 대한 전체 작업 권한 보유'
  },
  addMember: {
    modalTitle: '멤버 추가',
    successTips: '멤버 {{name}}이(가) 성공적으로 추가되었습니다'
  },
  updateMember: {
    modalTitle: '멤버 편집',
    successTips: '멤버 {{name}}이(가) 성공적으로 편집되었습니다'
  },
  memberForm: {
    username: '사용자 이름',
    usernameTips:
      '먼저 <0>시스템 설정-사용자 센터0>에서 사용자를 추가해야 합니다',
    isProjectAdmin: '프로젝트 관리 권한'
  },

  roleSelector: {
    role: '플랫폼 역할',
    opRange: '작업 범위',
    addRoleAndOpRange: '플랫폼 역할 및 작업 범위 추가'
  },

  memberGroupList: {
    title: '멤버 그룹 목록',
    deleteSuccessTips: '멤버 그룹 {{name}}이(가) 성공적으로 삭제되었습니다',
    deleteConfirmTitle: '멤버 그룹 {{name}}을(를) 삭제하시겠습니까?',

    columns: {
      userGroupName: '멤버 그룹 이름',
      users: '사용자 이름',
      opRanges: '플랫폼 작업 권한',
      opRangeTips: '형식 역할: [작업 범위 11, 작업 범위 2 ...]',
      isProjectAdmin: '프로젝트 관리자'
    },
    allPermission: '전체: 모든 DB 인스턴스에 대한 전체 작업 권한 보유'
  },
  memberGroupForm: {
    userGroupName: '멤버 그룹 이름',
    users: '사용자'
  },
  addMemberGroup: {
    modalTitle: '멤버 그룹 추가',
    successTips: '멤버 그룹 {{name}}이(가) 성공적으로 추가되었습니다'
  },
  updateMemberGroup: {
    modalTitle: '멤버 그룹 업데이트',
    successTips: '멤버 그룹 {{name}}이(가) 성공적으로 업데이트되었습니다'
  }
};
