import { AuthorizeType } from './index.enum';

export type AuthorizeFormFields = {
  authorizeType: AuthorizeType;
  userId: string[];
  memberGroupUid: string[];
};
