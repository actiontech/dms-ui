import {
  IGetUser,
  IGetOauth2TipsResData,
  IBasicInfo,
  ICompanyNotice,
  IListDBService
} from '@actiontech/shared/lib/api/base/service/common';
import { GetUserAuthenticationTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

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

export const BasicInfo: IBasicInfo = {
  components: [],
  logo_url: '/v1/dms/personalization/logo',
  title: 'Actiontech'
};

export const CompanyNotice: ICompanyNotice = {
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
    }
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
    }
  }
];
