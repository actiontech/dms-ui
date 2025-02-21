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

  DatabaseAccountDiscoveryModal = 'DatabaseAccountDiscoveryModal',

  DatabaseAccountDetailModal = 'DatabaseAccountDetailModal',

  DatabaseAccountAuthorizeModal = 'DatabaseAccountAuthorizeModal',

  DatabaseAccountModifyPasswordModal = 'DatabaseAccountModifyPasswordModal',

  DatabaseAccountRenewalPasswordModal = 'DatabaseAccountRenewalPasswordModal',

  DatabaseAccountBatchModifyPasswordModal = 'DatabaseAccountBatchModifyPasswordModal',

  DatabaseAccountManagePasswordModal = 'DatabaseAccountManagePasswordModal',

  DatabaseRoleDetailModal = 'DatabaseRoleDetailModal'
}

export enum EventEmitterKey {
  Refresh_Auth_List_Table = 'Refresh_Auth_List_Table',

  Refresh_Auth_Template_List_Table = 'Refresh_Auth_Template_List_Table',

  Refresh_Password_Management_list_Table = 'Refresh_Password_Management_list_Table',

  Refresh_Account_Management_List_Table = 'Refresh_Account_Management_List_Table',

  Create_Account_Sync_Service = 'Create_Account_Sync_Service',

  Refresh_Database_Role_List_Table = 'Refresh_Database_Role_List_Table'
}
