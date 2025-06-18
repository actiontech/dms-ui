import { Form } from 'antd';
import { BasicSelect, BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { IMemberGroupFormProps } from '../index.type';
import PermissionFields from '../../components/PermissionFields';
import { useEffect } from 'react';
import useUsername from '../../../../hooks/useUsername';
import { nameRule } from '@actiontech/shared/lib/utils/FormRule';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

const MemberGroupForm: React.FC<IMemberGroupFormProps> = ({
  form,
  isUpdate,
  projectID
}) => {
  const { t } = useTranslation();

  const {
    loading: getUsernameListLoading,
    updateUsernameList,
    generateUsernameSelectOption
  } = useUsername();

  useEffect(() => {
    updateUsernameList();
  }, [updateUsernameList]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('dmsMember.memberGroupForm.userGroupName')}
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
            name: t('dmsMember.memberGroupForm.userGroupName')
          })}
        />
      </Form.Item>
      <Form.Item
        name="userUids"
        label={t('dmsMember.memberGroupList.columns.users')}
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('user.userForm.username')
            })
          }
        ]}
      >
        <BasicSelect
          showSearch={true}
          loading={getUsernameListLoading}
          mode="multiple"
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsMember.memberGroupList.columns.users')
          })}
          optionFilterProp="children"
          filterOption={filterOptionByLabel}
        >
          {generateUsernameSelectOption()}
        </BasicSelect>
      </Form.Item>
      <PermissionFields projectID={projectID} />
    </Form>
  );
};

export default MemberGroupForm;
