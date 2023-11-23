import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProjectFormFields, ProjectFormProps } from '.';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { BasicInput } from '@actiontech/shared';

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
    </Form>
  );
};

export default ProjectForm;
