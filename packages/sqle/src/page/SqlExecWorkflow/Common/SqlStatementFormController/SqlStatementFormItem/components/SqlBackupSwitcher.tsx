import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { EmptyBox } from '@actiontech/shared';
import { Form } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { SqlBackupSwitcherProps } from './index.type';
import { CreateAuditTasksGroupReqV1ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useEffect, useMemo, useCallback } from 'react';
import useCreationMode from '../../../../Create/hooks/useCreationMode';
import SwitchField from './SwitchField';

const SqlBackupSwitcher: React.FC<SqlBackupSwitcherProps> = ({
  fieldPrefixPath,
  databaseInfo,
  isSameSqlForAll,
  isAtRejectStep,
  isAtFormStep,
  isAuditing
}) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const { isCloneMode } = useCreationMode();

  const currentExecuteMode = Form.useWatch(
    [fieldPrefixPath, 'exec_mode'],
    form
  );
  const getInstanceEnableBackup = useCallback(() => {
    if (isSameSqlForAll) {
      return databaseInfo.some((item) => item.enableBackup);
    }
    return (
      databaseInfo.find((item) => item.key === fieldPrefixPath)?.enableBackup ??
      false
    );
  }, [databaseInfo, fieldPrefixPath, isSameSqlForAll]);

  const enableBackupInstanceName = useMemo(() => {
    return databaseInfo
      .filter((i) => i.enableBackup)
      .map((i) => i.instanceName)
      .join(',');
  }, [databaseInfo]);

  useEffect(() => {
    if (isAtFormStep && !isAuditing.value && !isCloneMode) {
      const currentEnableBackup = getInstanceEnableBackup();

      form.setFieldValue([fieldPrefixPath, 'backup'], currentEnableBackup);
    }
  }, [
    fieldPrefixPath,
    getInstanceEnableBackup,
    form,
    isCloneMode,
    isAtFormStep,
    isAuditing
  ]);

  return (
    <EmptyBox
      if={
        currentExecuteMode !== CreateAuditTasksGroupReqV1ExecModeEnum.sql_file
      }
    >
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('execWorkflow.create.form.sqlInfo.switchSqlBackup')}
            tips={t('execWorkflow.create.form.sqlInfo.switchSqlBackupTips')}
          />
        }
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 2 }}
        name={[fieldPrefixPath, 'backup']}
        valuePropName="checked"
      >
        <SwitchField
          title={
            isSameSqlForAll
              ? t(
                  'execWorkflow.create.form.sqlInfo.cancelSwitchSqlBackupTipsWithInstanceName',
                  {
                    instanceName: enableBackupInstanceName
                  }
                )
              : t('execWorkflow.create.form.sqlInfo.cancelSwitchSqlBackupTips')
          }
          disabled={isAtRejectStep}
        />
      </FormItemLabel>
    </EmptyBox>
  );
};

export default SqlBackupSwitcher;
