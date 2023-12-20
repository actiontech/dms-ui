import { DefaultValue } from 'recoil';

export enum StoreKey {
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
