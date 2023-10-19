import type { FormInstance } from 'antd5/es/form';
import { IMemberRoleWithOpRange } from '@actiontech/shared/lib/api/base/service/common';

export interface IMemberFormFields {
  userUid: string;
  isProjectAdmin: boolean;
  roles?: IMemberRoleWithOpRange[];
}

export interface IMemberFormProps {
  form: FormInstance<IMemberFormFields>;
  isUpdate?: boolean;
  projectID: string;
}

export interface IMemberGroupFormFields {
  name: string;
  isProjectAdmin: boolean;
  roles?: IMemberRoleWithOpRange[];
  userUids: string[];
}

export interface IMemberGroupFormProps {
  form: FormInstance<IMemberGroupFormFields>;
  isUpdate?: boolean;
  projectID: string;
}
