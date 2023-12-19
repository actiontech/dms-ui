import {
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum
} from '../../api/base/service/common.enum';
import { SupportTheme, SystemRole } from '../../enum';

export const mockCurrentUserReturn = {
  isAdmin: true,
  username: 'admin',
  isProjectManager: jest.fn(),
  bindProjects: [
    {
      is_manager: true,
      project_name: 'default',
      project_id: '1'
    },
    {
      is_manager: false,
      project_name: 'test',
      project_id: '2'
    }
  ],
  managementPermissions: [
    {
      code: 1,
      desc: '创建项目'
    }
  ],
  projectID: '1',
  projectName: 'default',
  theme: SupportTheme.LIGHT,
  role: SystemRole.admin
};

export const mockProjectInfo = {
  projectID: '700300',
  projectName: 'default',
  projectArchive: false
};

export const mockUserInfo = {
  getUserInfoLoading: false,
  getUserInfo: jest.fn(),
  updateUserInfo: jest.fn(),
  clearUserInfo: jest.fn(),
  userInfo: {
    authentication_type: GetUserAuthenticationTypeEnum.dms,
    email: 'admin@gmail.com',
    is_admin: true,
    name: 'admin',
    op_permissions: [],
    phone: '13112341234',
    stat: GetUserStatEnum.正常,
    uid: '400200',
    user_bind_projects: [
      {
        is_manager: true,
        project_name: 'default',
        project_id: '1'
      }
    ],
    user_groups: [],
    wxid: 'wx_test_id'
  }
};
