import { Form } from 'antd';
import { BasicSelect, BasicSwitch, BasicToolTips } from '@actiontech/shared';
import { Trans, useTranslation } from 'react-i18next';
import { IMemberFormProps } from '../index.type';
import RoleSelector from '../../components/RoleSelector';
import { Link } from 'react-router-dom';
import { useRequest } from 'ahooks';
import UserService from '@actiontech/shared/lib/api/base/service/User';

const MemberForm: React.FC<IMemberFormProps> = ({
  form,
  isUpdate,
  projectID
}) => {
  const { t } = useTranslation();

  const isProjectAdmin = Form.useWatch('isProjectAdmin', form);

  const {
    data: usernameOptions,
    run: getUsernameOptions,
    loading: getUsernameListLoading
  } = useRequest(
    (filterByNameValue?: string) =>
      UserService.ListUsers({
        page_size: 999,
        filter_by_name_fuzzy: filterByNameValue
      }).then((res) => {
        return (res.data.data ?? []).map((v) => ({
          label: v.name,
          value: v.uid ?? ''
        }));
      }),
    {
      debounceWait: 600
    }
  );

  const handleSearch = (newValue: string) => {
    getUsernameOptions(newValue);
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="userUid"
        label={
          <BasicToolTips
            suffixIcon
            title={
              <Trans i18nKey={'dmsMember.memberForm.usernameTips'}>
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <Link target="_blank" to="/user-center" />
              </Trans>
            }
          >
            {t('dmsMember.memberForm.username')}
          </BasicToolTips>
        }
        validateFirst={true}
        rules={[
          {
            required: true,
            message: t('common.form.rule.require', {
              name: t('dmsMember.memberForm.username')
            })
          }
        ]}
      >
        <BasicSelect
          showSearch={true}
          loading={getUsernameListLoading}
          filterOption={false}
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsMember.memberForm.username')
          })}
          onSearch={handleSearch}
          options={usernameOptions}
        />
      </Form.Item>

      <Form.Item
        name="isProjectAdmin"
        label={t('dmsMember.memberForm.isProjectAdmin')}
        valuePropName="checked"
        initialValue={false}
      >
        <BasicSwitch />
      </Form.Item>
      {!isProjectAdmin ? <RoleSelector projectID={projectID} /> : null}
    </Form>
  );
};

export default MemberForm;
