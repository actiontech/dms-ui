import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProjectFormFields, ProjectFormProps } from '.';
import { nameRule } from '@actiontech/dms-kit';
import { BasicInput, BasicSelect } from '@actiontech/dms-kit';
import { ProjectPriorityOptions } from 'sqle/src/page/GlobalDashboard/index.data';
import BusinessField from './BusinessField';
const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  isUpdate = false
}) => {
  const { t } = useTranslation();
  return (
    <Form<ProjectFormFields> form={form} colon={false} layout="vertical">
      <Form.Item
        name="name"
        label={t('dmsProject.projectForm.name')}
        validateFirst={true}
        rules={[
          {
            required: true
          },
          ...nameRule()
        ]}
      >
        <BasicInput disabled={isUpdate} />
      </Form.Item>

      <Form.Item name="desc" label={t('dmsProject.projectForm.desc')}>
        <BasicInput.TextArea autoSize={true} />
      </Form.Item>
      <Form.Item
        name="priority"
        label={t('dmsProject.projectForm.priority')}
        rules={[
          {
            required: true
          }
        ]}
      >
        <BasicSelect options={ProjectPriorityOptions} />
      </Form.Item>
      <Form.Item
        name="businessTagId"
        rules={[
          {
            required: true
          }
        ]}
        label={t('dmsProject.projectForm.business')}
      >
        <BusinessField />
      </Form.Item>
    </Form>
  );
};
export default ProjectForm;
