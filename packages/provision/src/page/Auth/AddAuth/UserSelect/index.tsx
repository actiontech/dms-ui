import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { UserSelectProps } from '../index.type';
import useProvisionUser from '~/hooks/useProvisionUser';

const UserSelect: React.FC<UserSelectProps> = ({ className }) => {
  const { t } = useTranslation();

  const { updateUserList, userOptions } = useProvisionUser();

  useEffect(() => {
    updateUserList();
  }, [updateUserList]);

  return (
    <FormItemLabel
      name="permission_user_uid"
      label={t('auth.addAuth.purposeForm.username')}
      rules={[{ required: true }]}
      className={className}
    >
      <BasicSelect
        showSearch={true}
        optionFilterProp="label"
        options={userOptions}
      />
    </FormItemLabel>
  );
};

export default UserSelect;
