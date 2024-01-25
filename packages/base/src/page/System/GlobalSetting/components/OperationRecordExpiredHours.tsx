import { useTranslation } from 'react-i18next';

import { ConfigItem } from '@actiontech/shared';
import {
  EditInputNumber,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';

import useValidatorNumber from './useValidatorNumber';

export interface OperationRecordExpiredHoursProps {
  expiredHours: any;
  fieldVisible: any;
  showField: any;
  hideField: any;
  submitGlobalConfig: any;
}

const OperationRecordExpiredHours = ({
  expiredHours,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig
}: OperationRecordExpiredHoursProps) => {
  const { t } = useTranslation();
  const { messageContextHolder, integerValidator } = useValidatorNumber();

  return (
    <>
      {messageContextHolder}
      <ConfigItem
        label={
          <LabelContent>{`${t(
            'dmsSystem.global.operationRecordExpiredHours'
          )}(${t('common.time.hour')})`}</LabelContent>
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
              submitGlobalConfig(value, 'operation_record_expired_hours');
            }}
          />
        }
      />
    </>
  );
};

export default OperationRecordExpiredHours;
