import { FormInstance } from 'antd';
import ProjectForm from './ProjectForm';
import { ProjectV2ProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export type ProjectFormFields = {
  name: string;
  desc: string;
  isFixedBusiness: boolean;
  businessTagId: string;
  priority: ProjectV2ProjectPriorityEnum;
};

export type ProjectFormProps = {
  form: FormInstance<ProjectFormFields>;
  isUpdate?: boolean;
};

export default ProjectForm;
