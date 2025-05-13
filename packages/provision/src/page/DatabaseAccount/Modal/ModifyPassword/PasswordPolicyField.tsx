import { Form, Radio } from 'antd';
import {
  BasicInputNumber,
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { passwordExpirationPolicyOptions } from '../../Create/BaseInfoForm/index.data';
import { PasswordConfigPasswordExpirationPolicyEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

const PasswordPolicyField: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item
        name="effective_time_day"
        label={t('databaseAccount.create.form.effectiveTimeDay')}
        rules={[{ required: true }]}
        initialValue={30}
      >
        <BasicInputNumber min={0} />
      </Form.Item>
      <FormItemLabel
        label={
          <CustomLabelContent
            title={t('databaseAccount.create.form.passwordExpirationPolicy')}
            tips={t('databaseAccount.create.form.passwordExpirationPolicyTips')}
          />
        }
        name="password_expiration_policy"
        initialValue={
          PasswordConfigPasswordExpirationPolicyEnum.expiration_lock
        }
        className="has-label-tip"
      >
        <Radio.Group options={passwordExpirationPolicyOptions} />
      </FormItemLabel>
    </>
  );
};

export default PasswordPolicyField;
