// eslint-disable-next-line import/no-anonymous-default-export
export default {
  pageTitle: '사용자 센터',
  pageDesc:
    '사용자 센터에서 플랫폼 사용자, 사용자 그룹을 관리하고 플랫폼 역할 권한을 구성할 수 있습니다.',
  tabTitleUser: '사용자 관리',
  tabTitleRole: '역할 관리',

  user: {
    userList: {
      title: '사용자 목록',
      addUserButton: '사용자 추가',
      columns: {
        status: '상태',
        authenticationType: '사용자 인증 유형'
      }
    },
    userForm: {
      username: '사용자 이름',
      needUpdatePassWord: '비밀번호 업데이트 필요',
      passwordConfirm: '비밀번호 확인',
      passwordConfirmPlaceholder: '두 비밀번호 입력이 일치하도록 유지해 주세요',
      email: '이메일',
      phone: '전화번호',
      wxid: '위챗 ID',
      userGroups: '사용자 그룹',
      opPermissions: '플랫폼 관리 권한',
      isDisabled: '비활성화됨',
      disabledTips: '사용자가 비활성화되면 로그인할 수 없습니다'
    },
    createUser: {
      createSuccessTips: '사용자 "{{name}}" 추가 성공'
    },
    updateUser: {
      title: '사용자 편집',
      updateSuccessTips: '사용자 "{{name}}" 편집 성공'
    },
    deleteUser: {
      confirmTitle: '사용자 "{{username}}" 삭제를 확인하시겠습니까?',
      deleting: '사용자 "{{username}}" 삭제 중...',
      deleteSuccess: '사용자 "{{username}}" 삭제 성공'
    },
    userGroupList: {
      title: '사용자 그룹 목록',
      addUserGroupButton: '사용자 그룹 추가'
    },
    userGroupForm: {
      name: '사용자 그룹 이름',
      desc: '설명',
      bindUsers: '사용자 바인딩',
      isDisabled: '비활성화됨',
      isDisabledTips:
        '사용자 그룹이 비활성화되면 그룹 내 사용자는 비활성화되지 않지만, 사용자 그룹과 연결된 데이터 소스 및 해당 역할 권한을 잃게 됩니다'
    },
    createUserGroup: {
      title: '사용자 그룹 추가',
      successTips: '사용자 그룹 "{{name}}" 추가 성공'
    },
    updateUserGroup: {
      title: '사용자 그룹 편집',
      successTips: '사용자 그룹 "{{name}}" 편집 성공'
    },
    deleteUserGroup: {
      confirm: '사용자 그룹 "{{name}}" 삭제를 확인하시겠습니까?',
      deleting: '사용자 그룹 "{{name}}" 삭제 중...',
      deleteSuccess: '사용자 그룹 "{{name}}" 삭제 성공'
    }
  },
  role: {
    roleList: {
      title: '역할 목록',
      columns: {
        opPermissions: '플랫폼 작업 권한'
      }
    },
    roleForm: {
      name: '역할 이름',
      desc: '설명',
      opPermissions: '작업 권한',
      isDisabled: '비활성화됨'
    },
    createRole: {
      button: '역할 추가',
      modalTitle: '역할 추가',
      createSuccessTips: '역할 "{{name}}" 추가 성공'
    },

    updateRole: {
      modalTitle: '역할 편집',
      updateSuccessTips: '역할 "{{name}}" 편집 성공'
    },

    deleteRole: {
      deleteTips: '역할 "{{name}}" 삭제를 확인하시겠습니까?',
      deleting: '역할 "{{name}}" 삭제 중...',
      deleteSuccessTips: '역할 "{{name}}" 삭제 성공'
    },
    opPermissionList: {
      title: '작업 권한 목록',
      columns: {
        name: '작업 권한 이름',
        range: '작업 범위 세분성',
        desc: '설명'
      },
      rangeTypeDictionary: {
        global: '전역',
        project: '프로젝트',
        dbService: 'DB 인스턴스'
      }
    }
  }
};
