import {
  ILDAPConfigurationResData,
  ISMTPConfigurationResData,
  ITestSMTPConfigurationResData,
  IWeChatConfigurationResData,
  ITestWeChatConfigurationResData,
  IFeishuConfigurationResData,
  ITestFeishuConfigurationResData,
  IWebHookConfigurationData
} from '../../../../api/base/service/common';

export const LDAPConfig: ILDAPConfigurationResData = {
  enable_ldap: false,
  enable_ssl: true,
  ldap_server_host: '1',
  ldap_server_port: '1',
  ldap_connect_dn: '1',
  ldap_search_base_dn: '1',
  ldap_user_name_rdn_key: '1',
  ldap_user_email_rdn_key: '1'
};

export const oauthConfig = {
  access_token_tag: 'rpYV2tN4&545Jvkd3%J6',
  client_host: 'news://egyolphgg.tm/lundgwlpz',
  client_id: '6lq#s#aRibpMvhp48ztHOg@sZ3PxA2e(MYdS!CJANzLPBdg]m)',
  enable_oauth2: false,
  login_tip: 'VT[9[I$M(EW5R9o12*&Z',
  scopes: ['1XGCBu%brJrwjse@R^Ox', 'lpSLVoFnqZBfGHeI8023'],
  server_auth_url: 'prospero://tpmui.cf/timilp',
  server_token_url: 'mid://juckyny.na/xxsxnmf',
  server_user_id_url: 'cid://hqpbmxvbpl.cd/lcfyjtlkuj',
  server_logout_url: 'http://10.186.59.87:8080/realms/test/',
  user_id_tag: 'NFkVxY[4Xv^UFU&x&t5y',
  auto_create_user: false,
  skip_check_state: false,
  login_perm_expr: 'resource_access.sqle.roles.#(=="login")',
  back_channel_logout_uri: '/v1/dms/oauth2/backchannel_logout'
};

export const SMTPConfig: ISMTPConfigurationResData = {
  enable_smtp_notify: true,
  is_skip_verify: false,
  smtp_host: '10.10.10.1',
  smtp_port: '3300',
  smtp_username: 'currentUser@gamil.com'
};

export const successSMTPTestReturn: ITestSMTPConfigurationResData = {
  is_smtp_send_normal: true
};

export const failSMTPTestReturn: ITestSMTPConfigurationResData = {
  is_smtp_send_normal: false,
  send_error_message: 'error message'
};

export const weChatConfig: IWeChatConfigurationResData = {
  enable_wechat_notify: false,
  corp_id: '123123123',
  agent_id: 12312312312122,
  safe_enabled: false,
  proxy_ip: '1.1.1.1'
};

export const successWechatTestReturn: ITestWeChatConfigurationResData = {
  is_wechat_send_normal: true
};

export const larkConfig: IFeishuConfigurationResData = {
  app_id: 'app_id',
  is_feishu_notification_enabled: true
};

export const successLarkTestReturn: ITestFeishuConfigurationResData = {
  is_message_sent_normally: true
};

export const webhookConfig: IWebHookConfigurationData = {
  enable: false,
  token: undefined,
  max_retry_times: undefined,
  retry_interval_seconds: undefined,
  url: ''
};

export const successWebhookTestReturn = {
  is_message_sent_normally: true
};

export const mockModuleRedHotsData = [
  {
    module_name: 'global_dashboard',
    has_red_dot: true
  }
];

export const mockCodingConfigurationData = {
  coding_url: 'https://g-izbz2140.coding.net/',
  is_coding_enabled: true
};

export const mockSMSConfigurationData = {
  enable: true,
  url: 'absc1',
  sms_type: 'webhook',
  configuration: {
    token: '1231'
  }
};

export const mockGetLoginBasicConfigurationData = {
  login_button_text: 'Login',
  disable_user_pwd_login: false
};
