export enum ModalName {
  GetConnection = 'GET_CONNECTION',

  UpdateTemplateInAuth = 'UPDATE_TEMPLATE_IN_AUTH',

  UpdateUserInAuth = 'UPDATE_USER_IN_AUTH',

  UpdateExpirationInAuth = 'UPDATE_EXPIRATION_IN_AUTH',

  DataPermissionModal = 'DATA_PERMISSION_MODAL',

  CopyTemplate = 'COPY_TEMPLATE',

  UpdateSQLWorkbenchQueryStatus = 'UPDATE_SQL_WORKBENCH_QUERY_STATUS',

  CreatePasswordSecurityPolicyModal = 'CreatePasswordSecurityPolicyModal',

  UpdatePasswordSecurityPolicyModal = 'UpdatePasswordSecurityPolicyModal',

  AccountDiscoveryModal = 'AccountDiscoveryModal',

  AccountDetailModal = 'AccountDetailModal',

  AccountAuthorizeModal = 'AccountAuthorizeModal',

  AccountModifyPasswordModal = 'AccountModifyPasswordModal',

  AccountRenewalPasswordModal = 'AccountRenewalPasswordModal'
}

export enum EventEmitterKey {
  Refresh_Auth_List_Table = 'Refresh_Auth_List_Table',

  Refresh_Auth_Template_List_Table = 'Refresh_Auth_Template_List_Table',

  Refresh_Password_Management_list_Table = 'Refresh_Password_Management_list_Table',

  Refresh_Account_Management_List_Table = 'Refresh_Account_Management_List_Table',

  Create_Account_Sync_Service = 'Create_Account_Sync_Service'
}
