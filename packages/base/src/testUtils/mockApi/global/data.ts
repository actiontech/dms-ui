import {
  IGetUser,
  IGetOauth2TipsResData,
  IBasicInfo,
  ICompanyNotice,
  IListDBService
} from '@actiontech/shared/lib/api/base/service/common';
import {
  GetUserAuthenticationTypeEnum,
  ListDBServiceLastConnectionTestStatusEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

export const UserInfo = {
  token: 'Dhsiwkow133jn',
  name: 'test',
  userUid: '300123'
};

export const GetUserPayload: IGetUser = {
  authentication_type: GetUserAuthenticationTypeEnum.dms,
  email: 'test@gamil.com',
  is_admin: true,
  name: 'test',
  language: SupportLanguage.zhCN,
  uid: '300123',
  user_bind_projects: [
    {
      is_manager: true,
      project_id: '700300',
      project_name: 'default'
    }
  ]
};

export const oauth2Tips: IGetOauth2TipsResData = {
  enable_oauth2: true,
  login_tip: 'Login With Oauth2'
};

export const BasicInfoMockData: IBasicInfo = {
  components: [],
  logo_url: '/v1/dms/personalization/logo',
  title: 'Actiontech'
};

export const CompanyNoticeMockData: ICompanyNotice = {
  notice_str: 'notice',
  read_by_current_user: false
};

export const DBServicesList: IListDBService[] = [
  {
    uid: '1739531854064652288',
    name: 'mysql-1',
    db_type: 'MySQL',
    host: '10.186.62.13',
    port: '33061',
    user: 'root',
    password: 'Zgl4cTg5xeIq9c/pkc8Y5A==',
    business: 'test',
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '700300',
    sqle_config: {
      rule_template_name: 'default_MySQL',
      rule_template_id: '1',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: false
      }
    },
    is_enable_masking: true,
    instance_audit_plan_id: 1232,
    audit_plan_types: [
      { type: 'mysql_slow_log', desc: '慢日志', audit_plan_id: 1 }
    ],
    last_connection_test_error_message: '',
    last_connection_test_status:
      ListDBServiceLastConnectionTestStatusEnum.connect_success,
    last_connection_test_time: '2024-11-15T15:05:10.175+08:00',
    enable_backup: true
  },
  {
    uid: '1739531942258282496',
    name: 'mysql-2',
    db_type: 'MySQL',
    host: '10.186.62.13',
    port: '33062',
    user: 'root',
    password: 'Zgl4cTg5xeIq9c/pkc8Y5A==',
    business: 'test-2',
    maintenance_times: [],
    desc: '',
    source: 'SQLE',
    project_uid: '700300',
    sqle_config: {
      rule_template_name: 'default_MySQL',
      rule_template_id: '1',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: false
      }
    },
    is_enable_masking: false,
    last_connection_test_error_message: 'error message',
    last_connection_test_status:
      ListDBServiceLastConnectionTestStatusEnum.connect_failed,
    last_connection_test_time: '2024-11-15T15:05:10.175+08:00',
    enable_backup: false
  }
];

export const mockVerifyLoginData = {
  verify_failed_msg: '',
  user_uid: '700200',
  two_factor_enabled: false
};

export const maskRuleData = [
  {
    effect: '182****8767',
    id: 1,
    description: '手机号码',
    masking_type: '电话',
    reference_fields: ['电话', '投诉电话']
  },
  {
    id: 2,
    masking_type: '护照',
    reference_fields: ['passport', '护照']
  },
  {
    effect: '182****8780',
    id: 3,
    reference_fields: ['SSN']
  },
  {
    effect: '182****8790',
    id: 4
  }
];
