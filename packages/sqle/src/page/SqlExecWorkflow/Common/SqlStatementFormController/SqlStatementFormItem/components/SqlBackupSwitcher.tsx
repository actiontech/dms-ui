import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { EmptyBox } from '@actiontech/shared';
import { Form } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { SqlBackupSwitcherProps } from './index.type';
import { CreateAuditTasksGroupReqV1ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';

import SwitchField from './SwitchField';

const SqlBackupSwitcher: React.FC<SqlBackupSwitcherProps> = ({
  fieldPrefixPath,
  databaseInfo
}) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const currentExecuteMode = Form.useWatch(
    [fieldPrefixPath, 'exec_mode'],
    form
  );
  const isSameSqlForAll = Form.useWatch('isSameSqlForAll', form);

  const getInitValue = () => {
    if (isSameSqlForAll) {
      return databaseInfo.some((item) => item.enableBackup);
    }
    return (
      databaseInfo.find((item) => item.key === fieldPrefixPath)?.enableBackup ??
      false
    );
  };

  const enableBackupInstanceName = useMemo(() => {
    let nameStr = '';
    databaseInfo.forEach((item, index) => {
      if (item.enableBackup) {
        nameStr += `${item.instanceName}${
          index === databaseInfo.length - 1 ? '' : ','
        }`;
      }
    });
    return nameStr;
  }, [databaseInfo]);

  return (
    <EmptyBox
      if={
        currentExecuteMode !== CreateAuditTasksGroupReqV1ExecModeEnum.sql_file
      }
    >
      <FormItemLabel
        label={t('execWorkflow.create.form.sqlInfo.switchSqlBackup')}
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 2 }}
        name={[fieldPrefixPath, 'backup']}
        valuePropName="checked"
        initialValue={getInitValue()}
      >
        <SwitchField
          title={
            isSameSqlForAll
              ? t('execWorkflow.create.form.sqlInfo.cancelSwitchSqlBackupTips')
              : t(
                  'execWorkflow.create.form.sqlInfo.cancelSwitchSqlBackupTipsWithInstanceName',
                  {
                    instanceName: enableBackupInstanceName
                  }
                )
          }
        />
      </FormItemLabel>
    </EmptyBox>
  );
};

export default SqlBackupSwitcher;
