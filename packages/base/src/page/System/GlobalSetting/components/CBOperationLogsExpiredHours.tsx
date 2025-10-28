import { useTranslation } from 'react-i18next';
import { ConfigItem } from '@actiontech/shared';
import {
  EditInputNumber,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import useValidatorNumber from './useValidatorNumber';
import { IUpdateSystemVariablesReqV1 } from '@actiontech/shared/lib/api/base/service/common';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/features';

export interface CBOperationLogsExpiredHoursProps {
  expiredHours: number | undefined;
  fieldVisible: boolean;
  showField: () => void;
  hideField: () => void;
  submitGlobalConfig: (
    value: string | number,
    fieldName: keyof IUpdateSystemVariablesReqV1
  ) => void;
}

const CBOperationLogsExpiredHours = ({
  expiredHours,
  fieldVisible,
  showField,
  hideField,
  submitGlobalConfig
}: CBOperationLogsExpiredHoursProps) => {
  const { t } = useTranslation();
  const { messageContextHolder, integerValidator } = useValidatorNumber();
  const { checkActionPermission } = usePermission();
  return (
    <>
      {messageContextHolder}
      <ConfigItem
        label={
          <LabelContent>{`${t(
            'dmsSystem.global.cbOperationLogsExpiredHours'
          )}(${t('common.time.hour')})`}</LabelContent>
        }
        descNode={String(expiredHours ?? '-')}
        fieldVisible={fieldVisible}
        showField={showField}
        hideField={hideField}
        needEditButton={checkActionPermission(
          PERMISSIONS.ACTIONS.BASE.SYSTEM.GLOBAL_SETTING
            .CB_OPERATION_LOG_EXPIRED_HOURS
        )}
        inputNode={
          <EditInputNumber
            fieldValue={expiredHours ?? 2160}
            validator={(value: number) => integerValidator(String(value))}
            hideField={hideField}
            onSubmit={(value: number) => {
              submitGlobalConfig(value, 'cb_operation_logs_expired_hours');
            }}
          />
        }
      />
    </>
  );
};

export default CBOperationLogsExpiredHours;
