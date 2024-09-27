import {
  GetUserAuthenticationTypeEnum,
  GetUserStatEnum,
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../api/base/service/common.enum';
import { OpPermissionTypeUid, SupportTheme, SystemRole } from '../../enum';
import DatabaseTypeLogo from '../../components/DatabaseTypeLogo';
import { SupportLanguage } from '../../enum';

export const mockCurrentUserReturn = {
  isAdmin: true,
  isProjectManager: jest.fn(),
  username: 'admin',
  bindProjects: [
    {
      is_manager: true,
      project_name: 'default',
      project_id: '1',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'test',
      project_id: '2',
      archived: false
    }
  ],
  managementPermissions: [
    {
      uid: OpPermissionTypeUid.create_project,
      name: '创建项目'
    }
  ],
  projectID: '1',
  projectName: 'default',
  theme: SupportTheme.LIGHT,
  language: SupportLanguage.zhCN,
  updateLanguage: jest.fn(),
  role: SystemRole.admin,
  updateTheme: jest.fn(),
  useInfoFetched: true,
  uid: '500300',
  isCertainProjectManager: true,
  userRoles: {
    [SystemRole.admin]: true,
    [SystemRole.certainProjectManager]: true,
    [SystemRole.globalViewing]: true
  },
  hasGlobalViewingPermission: true
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
    wxid: 'wx_test_id',
    access_token_info: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHA',
      is_expired: false,
      token_expired_timestamp: '2024-03-31T10:25:10+08:00'
    }
  }
};

export const mockDBServiceDriverInfo = {
  driverNameList: ['MySQL'],
  loading: false,
  driverMeta: [
    {
      db_type: 'MySQL',
      logo_path: '',
      params: []
    }
  ],
  dbDriverOptions: [
    {
      text: 'MySQL',
      value: 'MysQL',
      label: <DatabaseTypeLogo dbType="MySQL" logoUrl="" />
    }
  ],
  updateDriverList: jest.fn(),
  updateDriverListAsync: jest.fn(),
  getLogoUrlByDbType: jest.fn(),
  generateDriverSelectOptions: jest.fn(),
  driverInfoFetched: true,
  setDriverInfoFetched: jest.fn()
};

export const mockFeaturePermissionData = {
  loading: false,
  updateFeaturePermission: jest.fn(),
  featurePermissionFetched: true
};

export const mockCurrentPermissionData = {
  sqlOptimizationIsSupported: true
};

export const mockUseProjectBusinessTipsData = {
  projectBusiness: ['business1', 'business2'],
  loading: false,
  updateProjectBusinessTips: jest.fn(),
  projectBusinessOption: () => [
    {
      label: 'business1',
      value: 'business1'
    },
    {
      label: 'business2',
      value: 'business2'
    }
  ],
  isFixedBusiness: true
};

export const mockUseUserOperationPermissionData = {
  userOperationPermission: {
    is_admin: true,
    op_permission_list: [
      {
        range_uids: ['700300'],
        range_type: OpPermissionItemRangeTypeEnum.project,
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.project_admin
      }
    ]
  },
  loading: false,
  updateUserOperationPermission: jest.fn(),
  isHaveServicePermission: jest.fn()
};
