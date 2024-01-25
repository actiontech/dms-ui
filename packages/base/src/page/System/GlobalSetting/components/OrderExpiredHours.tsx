import { useTranslation } from 'react-i18next';

import { ConfigItem } from '@actiontech/shared';
import {
  EditInputNumber,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';

import useValidatorNumber from './useValidatorNumber';

export interface OrderExpiredHoursProps {
  expiredHours: any;
  fieldVisible: any;
  showField: any;
  hideField: any;
  submitGlobalConfig: any;
}

const OrderExpiredHours = ({
  expiredHours,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig
}: OrderExpiredHoursProps) => {
  const { t } = useTranslation();
  const { messageContextHolder, integerValidator } = useValidatorNumber();

  return (
    <>
      {messageContextHolder}
      <ConfigItem
        label={
          <LabelContent>{`${t('dmsSystem.global.orderExpiredHours')}(${t(
            'common.time.hour'
          )})`}</LabelContent>
        }
        descNode={String(expiredHours ?? '-')}
        fieldVisible={fieldVisible}
        showField={showField}
        hideField={hideField}
        inputNode={
          <EditInputNumber
            fieldValue={expiredHours ?? 2160}
            validator={(value: number) => integerValidator(String(value))}
            hideField={hideField}
            onSubmit={(value: number) => {
              submitGlobalConfig(value, 'workflow_expired_hours');
            }}
          />
        }
      />
    </>
  );
};

export default OrderExpiredHours;
