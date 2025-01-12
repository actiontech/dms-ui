import { useTranslation } from 'react-i18next';
import { BasicSelect } from '@actiontech/shared';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import CronInputCom from '@actiontech/shared/lib/components/CronInput/CronInput';

type Props = {
  submitPending: boolean;
  fetchUserTipsPending: boolean;
  generateUsernameSelectOption: () => JSX.Element[];
};

const ConfigFields: React.FC<Props> = ({
  submitPending,
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
        <CronInputCom disabled={submitPending} />
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
        <BasicSelect
          disabled={submitPending}
          mode="multiple"
          loading={fetchUserTipsPending}
        >
          {generateUsernameSelectOption()}
        </BasicSelect>
      </FormItemLabel>
    </>
  );
};

export default ConfigFields;
