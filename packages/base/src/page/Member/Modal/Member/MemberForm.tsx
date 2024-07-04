import { useEffect } from 'react';
import { Form } from 'antd';
import { BasicSelect, BasicSwitch, BasicToolTips } from '@actiontech/shared';
import { Trans, useTranslation } from 'react-i18next';
import { IMemberFormProps } from '../index.type';
import useUsername from '../../../../hooks/useUsername';
import RoleSelector from '../../components/RoleSelector';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { Link } from 'react-router-dom';

const MemberForm: React.FC<IMemberFormProps> = ({
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

  const isProjectAdmin = Form.useWatch('isProjectAdmin', form);

  useEffect(() => {
    updateUsernameList();
  }, [updateUsernameList]);

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
          optionFilterProp="children"
          filterOption={filterOptionByLabel}
          disabled={isUpdate}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsMember.memberForm.username')
          })}
        >
          {generateUsernameSelectOption()}
        </BasicSelect>
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
