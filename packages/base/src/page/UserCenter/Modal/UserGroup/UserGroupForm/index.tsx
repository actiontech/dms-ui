import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { Form, Select, Switch } from 'antd';
import { BasicInput, BasicSelect } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { UserGroupFormProps } from './index.type';
import { EmptyBox } from '@actiontech/shared';
import { BasicToolTips } from '@actiontech/shared';

const UserGroupForm: React.FC<UserGroupFormProps> = (props) => {
  const { form, userList, isUpdate } = props;
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('dmsUserCenter.user.userGroupForm.name')}
        rules={[
          {
            required: true
          },
          ...nameRule()
        ]}
      >
        <BasicInput
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userGroupForm.name')
          })}
        />
      </Form.Item>
      <Form.Item name="desc" label={t('dmsUserCenter.user.userGroupForm.desc')}>
        <BasicInput.TextArea
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userGroupForm.desc')
          })}
        />
      </Form.Item>
      <EmptyBox if={isUpdate}>
        <Form.Item
          name="isDisabled"
          label={
            <BasicToolTips
              suffixIcon
              titleWidth={320}
              title={t('dmsUserCenter.user.userGroupForm.isDisabledTips')}
            >
              {t('dmsUserCenter.user.userGroupForm.isDisabled')}
            </BasicToolTips>
          }
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        name="userList"
        label={t('dmsUserCenter.user.userGroupForm.bindUsers')}
      >
        <BasicSelect
          showSearch
          mode="multiple"
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsUserCenter.user.userGroupForm.bindUsers')
          })}
        >
          {userList?.map((user) => (
            <Select.Option key={user.uid} value={user.uid ?? ''}>
              {user.name}
            </Select.Option>
          ))}
        </BasicSelect>
      </Form.Item>
    </Form>
  );
};

export default UserGroupForm;
