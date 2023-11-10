import { DefaultValue } from 'recoil';

export enum StoreKey {
  Global_Token = 'Global_Token',
  Global_Token_Selector = 'Global_Token_Selector',

  Global_Username = 'Global_Username',
  Global_Theme = 'Global_Theme',

  User_Modal_Status = 'User_Modal_Status',

  User_Selected_Data = 'User_Selected_Data',

  Data_Object_Modal_Status = 'Data_Object_Modal_Status',

  Data_Object_Selected_Data = 'Data_Object_Selected_Data',

  External_Data_Source_Modal_Status = 'External_Data_Source_Modal_Status',

  External_Data_Source_Selected_Data = 'External_Data_Source_Selected_Data',

  Auth_List_Modal_Status = 'Auth_List_Modal_Status',

  Auth_List_Selected_Data = 'Auth_List_Selected_Data',

  Auth_Template_Modal_Status = 'Auth_Template_Modal_Status',

  Auth_Data_Permission_List_Modal_Status = 'Auth_Data_Permission_List_Modal_Status',

  Auth_Template_List_Selected_Data = 'Auth_Template_List_Selected_Data'
}

export const recoilIsInstanceOfDefaultValue = (
  value: unknown
): value is DefaultValue => {
  return value instanceof DefaultValue;
};
