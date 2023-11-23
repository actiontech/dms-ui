import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';

export type ProjectFormFields = {
  name: string;
  desc: string;
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
