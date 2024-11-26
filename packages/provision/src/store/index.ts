import { DefaultValue } from 'recoil';

export enum StoreKey {
  Auth_List_Modal_Status = 'Auth_List_Modal_Status',

  Auth_List_Selected_Data = 'Auth_List_Selected_Data',

  Auth_Template_Modal_Status = 'Auth_Template_Modal_Status',

  Auth_Data_Permission_List_Modal_Status = 'Auth_Data_Permission_List_Modal_Status',

  Auth_Template_List_Selected_Data = 'Auth_Template_List_Selected_Data',

  Password_Security_policy_Modal_Status = 'Password_Security_policy_Modal_Status',

  Password_Security_policy_Select_Data = 'Password_Security_policy_Select_Data',

  Database_Account_Management_Modal_Status = 'Database_Account_Management_Modal_Status',

  Database_Account_Management_Modal_Select_Data = 'Database_Account_Management_Modal_Select_Data',

  Database_Account_Management_Modal_Batch_Action_Select_Data = 'Database_Account_Management_Modal_Batch_Action_Select_Data',

  Database_Role_Modal_Status = 'Database_Role_Modal_Status',

  Database_Role_Select_Data = 'Database_Role_Select_Data',

  Database_Role_Filtered_DB_Service_ID = 'Database_Role_Filtered_DB_Service_ID',

  Database_Role_Filtered_DB_Service_Name = 'Database_Role_Filtered_DB_Service_Name'
}

export const recoilIsInstanceOfDefaultValue = (
  value: unknown
): value is DefaultValue => {
  return value instanceof DefaultValue;
};
