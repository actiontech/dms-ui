import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProjectFormFields, ProjectFormProps } from '.';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { BasicInput, BasicSwitch, EmptyBox } from '@actiontech/shared';
import BusinessListField from './BusinessListField';
import { FormListAddButtonWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import { PlusCircleFilled } from '@actiontech/icons';

const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  isUpdate = false
}) => {
  const { t } = useTranslation();

  const fixedBusiness = Form.useWatch('isFixedBusiness', form);
  const business = Form.useWatch('business', form);

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
      <FormItemLabel
        name="isFixedBusiness"
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('dmsProject.projectForm.fixedBusiness')}
            tips={t('dmsProject.projectForm.fixedBusinessExtra')}
          />
        }
        valuePropName="checked"
        initialValue={true}
      >
        <BasicSwitch />
      </FormItemLabel>
      <EmptyBox if={fixedBusiness}>
        <Form.List name="business" initialValue={[{ name: '' }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} className="config-item-filed">
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    label={
                      index === 0 ? t('dmsProject.projectForm.business') : ''
                    }
                    rules={[
                      {
                        required: true,
                        message: t('common.form.rule.require', {
                          name: t('dmsProject.projectForm.businessName')
                        })
                      }
                    ]}
                  >
                    <BusinessListField
                      onDelete={() => {
                        remove(index);
                      }}
                      deletable={!business?.[index]?.is_used}
                      lastItem={business?.length === 1}
                    />
                  </Form.Item>
                </Space>
              ))}
              <Form.Item label="" colon={false}>
                <FormListAddButtonWrapper
                  icon={<PlusCircleFilled />}
                  onClick={() => {
                    add();
                  }}
                  className="form-list-add"
                >
                  {t('dmsProject.projectForm.addBusiness')}
                </FormListAddButtonWrapper>
              </Form.Item>
            </>
          )}
        </Form.List>
      </EmptyBox>
    </Form>
  );
};

export default ProjectForm;
