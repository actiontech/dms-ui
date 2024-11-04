import { useTranslation } from 'react-i18next';
import { ConfigItem } from '@actiontech/shared';
import {
  EditInputNumber,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import useValidatorNumber from './useValidatorNumber';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/global';

export interface OperationRecordExpiredHoursProps {
  expiredHours: number | undefined;
  fieldVisible: boolean;
  showField: () => void;
  hideField: () => void;
  submitGlobalConfig: (
    value: string | number,
    fieldName: keyof IUpdateSystemVariablesReqV1
  ) => void;
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
  const { checkActionPermission } = usePermission();
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
        needEditButton={checkActionPermission(
          PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING
            .OPERATION_LOG_EXPIRED_HOURS
        )}
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
