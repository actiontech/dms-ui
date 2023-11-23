import { FormInstance } from 'antd';

export interface AssignmentFormField {
  assignees: string[];
}

export interface IAssignmentForm {
  form: FormInstance<AssignmentFormField>;
  submitLoading: boolean;
  init: boolean;
}
