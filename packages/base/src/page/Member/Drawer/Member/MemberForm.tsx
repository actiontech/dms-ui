import { useEffect } from 'react';
import { Form } from 'antd';
import { BasicSelect, BasicToolTip } from '@actiontech/dms-kit';
import { TypedLink } from '@actiontech/shared';
import { Trans, useTranslation } from 'react-i18next';
import { IMemberFormProps } from '../index.type';
import useUsername from '../../../../hooks/useUsername';
import PermissionFields from '../../components/PermissionFields';
import { filterOptionByLabel } from '@actiontech/dms-kit';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
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
  useEffect(() => {
    updateUsernameList();
  }, [updateUsernameList]);
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="userUid"
        label={
          <BasicToolTip
            suffixIcon
            title={
              <Trans i18nKey={'dmsMember.memberForm.usernameTips'}>
                <TypedLink target="_blank" to={ROUTE_PATHS.BASE.USER_CENTER} />
              </Trans>
            }
          >
            {t('dmsMember.memberForm.username')}
          </BasicToolTip>
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
      <PermissionFields projectID={projectID} />
    </Form>
  );
};
export default MemberForm;
