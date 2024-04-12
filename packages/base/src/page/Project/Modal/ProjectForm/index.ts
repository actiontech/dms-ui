import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';
import { IBusiness } from '@actiontech/shared/lib/api/base/service/common';
export type ProjectFormFields = {
  name: string;
  desc: string;
  isFixedBusiness: boolean;
  business?: IBusiness[];
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
