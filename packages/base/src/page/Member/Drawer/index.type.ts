import type { FormInstance } from 'antd/es/form';
import { IMemberRoleWithOpRange } from '@actiontech/shared/lib/api/base/service/common';

export interface IMemberFormFields {
  userUid: string;
  isProjectAdmin: boolean;
  roles?: IMemberRoleWithOpRange[];
  projectManagementPermission?: string[];
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
  projectManagementPermission?: string[];
}

export interface IMemberGroupFormProps {
  form: FormInstance<IMemberGroupFormFields>;
  isUpdate?: boolean;
  projectID: string;
}
