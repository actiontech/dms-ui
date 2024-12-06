import {
  FormItemLabel,
  CustomLabelContent
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { EmptyBox, BasicInputNumber, BasicToolTips } from '@actiontech/shared';
import { Form } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { SqlBackupSwitcherProps } from './index.type';
import { CreateAuditTasksGroupReqV1ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useEffect, useMemo, useCallback } from 'react';
import useCreationMode from '../../../../Create/hooks/useCreationMode';
import SwitchField from './SwitchField';
import { InfoCircleOutlined } from '@actiontech/icons';
import { sortBy } from 'lodash';

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

  const enableBackup = Form.useWatch([fieldPrefixPath, 'backup'], form);

  const getInstanceEnableBackup = useCallback(() => {
    if (isSameSqlForAll) {
      return databaseInfo.some((item) => item.enableBackup);
    }
    return (
      databaseInfo.find((item) => item.key === fieldPrefixPath)?.enableBackup ??
      false
    );
  }, [databaseInfo, fieldPrefixPath, isSameSqlForAll]);

  const getInstanceBackupMaxRows = useCallback(() => {
    if (isSameSqlForAll) {
      const enableBackupInstances = databaseInfo.filter((i) => i.enableBackup);
      // 相同SQL模式下 多个数据源的行数限制选最小值
      return !!enableBackupInstances.length
        ? sortBy(enableBackupInstances, 'backupMaxRows')?.[0]?.backupMaxRows
        : 1000;
    }
    return (
      databaseInfo.find((item) => item.key === fieldPrefixPath)
        ?.backupMaxRows ?? 1000
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
      if (!form.isFieldTouched([fieldPrefixPath, 'backup'])) {
        form.setFieldValue([fieldPrefixPath, 'backup'], currentEnableBackup);
      }

      if (!form.isFieldTouched([fieldPrefixPath, 'backupMaxRows'])) {
        form.setFieldValue(
          [fieldPrefixPath, 'backupMaxRows'],
          getInstanceBackupMaxRows()
        );
      }
    }
  }, [
    fieldPrefixPath,
    getInstanceEnableBackup,
    form,
    isCloneMode,
    isAtFormStep,
    isAuditing,
    getInstanceBackupMaxRows
  ]);

  const allowBackup = useMemo(() => {
    return databaseInfo.find((item) => item.key === fieldPrefixPath)
      ?.allowBackup;
  }, [databaseInfo, fieldPrefixPath]);

  return (
    <EmptyBox
      if={
        currentExecuteMode !==
          CreateAuditTasksGroupReqV1ExecModeEnum.sql_file && allowBackup
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
      <EmptyBox if={enableBackup}>
        <FormItemLabel
          className="has-label-tip"
          label={
            <CustomLabelContent
              title={
                <BasicToolTips
                  title={t(
                    'execWorkflow.create.form.sqlInfo.backupMaxRowsLimitTooltips'
                  )}
                  suffixIcon={<InfoCircleOutlined width={14} height={14} />}
                >
                  {t('execWorkflow.create.form.sqlInfo.backupMaxRowsLimit')}
                </BasicToolTips>
              }
              tips={t(
                'execWorkflow.create.form.sqlInfo.backupMaxRowsLimitTips'
              )}
            />
          }
          labelCol={{ span: 14 }}
          wrapperCol={{ span: 10 }}
          name={[fieldPrefixPath, 'backupMaxRows']}
          initialValue={1000}
        >
          <BasicInputNumber min={0} disabled={getInstanceEnableBackup()} />
        </FormItemLabel>
      </EmptyBox>
    </EmptyBox>
  );
};

export default SqlBackupSwitcher;
