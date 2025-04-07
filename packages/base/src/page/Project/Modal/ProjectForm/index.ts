import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';
import { ProjectProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type ProjectFormFields = {
  name: string;
  desc: string;
  isFixedBusiness: boolean;
  businessTag: number;
  priority: ProjectProjectPriorityEnum;
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
