import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';
import { IBusiness } from '@actiontech/shared/lib/api/base/service/common';
import { ProjectProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type ProjectFormFields = {
  name: string;
  desc: string;
  isFixedBusiness: boolean;
  business?: IBusiness[];
  priority: ProjectProjectPriorityEnum;
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
