export enum SupportTheme {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum ModalName {
  AddUser = 'ADD_USER',

  ActivateUser = 'ACTIVATE_USER',

  UpdateUserPermission = 'UPDATE_USER_PERMISSION',

  AddDataObject = 'ADD_DATA_OBJECT',

  ViewAccount = 'VIEW_ACCOUNT',

  ImportExternalDataSource = 'IMPORT_EXTERNAL_DATA_SOURCE',

  EditExternalDataSource = 'EDIT_EXTERNAL_DATA_SOURCE',

  GetConnection = 'GET_CONNECTION',

  UpdateTemplateInAuth = 'UPDATE_TEMPLATE_IN_AUTH',

  UpdateUserInAuth = 'UPDATE_USER_IN_AUTH',

  UpdateExpirationInAuth = 'UPDATE_EXPIRATION_IN_AUTH',

  DataPermissionModal = 'DATA_PERMISSION_MODAL',

  CopyTemplate = 'COPY_TEMPLATE'
}

export enum EventEmitterKey {
  Refresh_User_List_Table = 'Refresh_User_List_Table',

  Refresh_Data_Object_List_Table = 'Refresh_Data_Object_List_Table',

  Refresh_External_Data_Source_List_Table = 'Refresh_External_Data_Source_List_Table',

  Refresh_Auth_List_Table = 'Refresh_Auth_List_Table',

  Refresh_Auth_Template_List_Table = 'Refresh_Auth_Template_List_Table'
}
