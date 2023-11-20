import { useTranslation } from 'react-i18next';
import { useContext } from 'react';

import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import CronInputCom from '@actiontech/shared/lib/components/CronInput';

import { checkCron } from '@actiontech/shared/lib/components/CronInput/useCron/cron.tool';
import { FormSubmitStatusContext } from '..';

const defaultVal = '0 0 * * *';

const Cron = () => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);

  return (
    <>
      <FormItemLabel
        className="has-required-style has-label-tip"
        label={
          <div className="label-cont-custom">
            <div>{t('auditPlan.planForm.cronName.label')}</div>
            <div className="tip-content-box">
              {t('auditPlan.planForm.cronName.tip')}
            </div>
          </div>
        }
        {...formItemLayout.fullLine}
        name="cron"
        initialValue={defaultVal}
        rules={[
          {
            required: true
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
        <CronInputCom disabled={submitLoading} />
      </FormItemLabel>
    </>
  );
};

export default Cron;
