import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import CronInputCom from '@actiontech/shared/lib/components/CronInput';
import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';

type Props = {
  fetchUserTipsPending: boolean;
  generateUsernameSelectOption: () => JSX.Element[];
};

const ConfigFields: React.FC<Props> = ({
  fetchUserTipsPending,
  generateUsernameSelectOption
}) => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemLabel
        className="has-required-style has-label-tip"
        name="minutesInterval"
        label={
          <CustomLabelContent
            title={t(
              'pushRule.pushRule.sqlManagementIssuePush.form.pushFrequency'
            )}
            tips={t('pushRule.pushRule.sqlManagementIssuePush.form.cronTips')}
          />
        }
        initialValue="* * * * *"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t(
                'pushRule.pushRule.sqlManagementIssuePush.form.pushFrequency'
              )
            })
          },
          {
            validator(_, value) {
              const error = checkCron(value);
              if (error === '') {
                return Promise.resolve();
              }
              return Promise.reject(t(error));
            }
          }
        ]}
      >
        <CronInputCom />
      </FormItemLabel>

      <FormItemLabel
        className="has-required-style"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('pushRule.pushRule.sqlManagementIssuePush.form.pusher')
            })
          }
        ]}
        name="pushUserList"
        label={t('pushRule.pushRule.sqlManagementIssuePush.form.pusher')}
      >
        <BasicSelect mode="multiple" loading={fetchUserTipsPending}>
          {generateUsernameSelectOption()}
        </BasicSelect>
      </FormItemLabel>
    </>
  );
};

export default ConfigFields;