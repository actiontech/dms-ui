import { ModeSwitcher } from '@actiontech/dms-kit';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormItemLabel, FormItemNoLabel } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { defaultUploadTypeOptions } from './index.data';
import { SqlStatementFormItemProps } from './index.type';
import { useMemo } from 'react';
import SqlUploadContent from './components/SqlUploadContent';
import { Form } from 'antd';
import { SqlAuditInfoFormProps } from '../../../Create/components/FormStep/SqlAuditInfoForm/index.type';
import SqlExecModeSelector from './components/SqlExecModeSelector';
import SqlFormatterAndSubmitter from './components/SqlFormatterAndSubmitter';
import { RingPieFilled } from '@actiontech/icons';
import SqlBackupSwitcher from './components/SqlBackupSwitcher';
const SqlStatementFormItem: React.FC<SqlStatementFormItemProps> = ({
  fieldPrefixPath,
  clearSqlContentFormWhenChangeUploadType = true,
  isAuditing,
  auditAction,
  disabledUploadType,
  databaseInfo,
  isSameSqlForAll,
  isSupportFileModeExecuteSql,
  isAtRejectStep,
  isAtFormStep,
  setActiveKey
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormProps>();
  const currentUploadTypeFieldName = useMemo(() => {
    return [fieldPrefixPath, 'currentUploadType'];
  }, [fieldPrefixPath]);
  const currentUploadType = Form.useWatch(
    currentUploadTypeFieldName,
    form
  ) as AuditTaskResV1SqlSourceEnum;
  const uploadTypeChangeHandle = () => {
    if (clearSqlContentFormWhenChangeUploadType) {
      form.resetFields([
        [fieldPrefixPath, 'form_data'],
        [fieldPrefixPath, 'sql_file'],
        [fieldPrefixPath, 'zip_file']
      ]);
    }
  };
  return (
    <>
      <FormItemLabel
        label={
          <>
            <RingPieFilled className="custom-icon-ellipse" />
            <span>{t('execWorkflow.create.form.sqlInfo.uploadType')}</span>
          </>
        }
        className="form-item-label-mb-16"
      />

      <FormItemNoLabel
        name={currentUploadTypeFieldName}
        initialValue={defaultUploadTypeOptions[0].value}
      >
        <ModeSwitcher
          rowProps={{
            gutter: 12
          }}
          options={defaultUploadTypeOptions}
          onChange={uploadTypeChangeHandle}
          disabled={disabledUploadType}
        />
      </FormItemNoLabel>

      <SqlUploadContent
        currentSqlUploadType={currentUploadType}
        fieldPrefixPath={fieldPrefixPath}
      />

      <SqlExecModeSelector
        currentSqlUploadType={currentUploadType}
        fieldPrefixPath={fieldPrefixPath}
        isSupportFileModeExecuteSql={isSupportFileModeExecuteSql}
        isAtRejectStep={isAtRejectStep}
      />
      {/* #if [ee] */}
      <SqlBackupSwitcher
        fieldPrefixPath={fieldPrefixPath}
        databaseInfo={databaseInfo}
        isSameSqlForAll={isSameSqlForAll}
        isAtRejectStep={isAtRejectStep}
        isAtFormStep={isAtFormStep}
        isAuditing={isAuditing}
      />
      {/* #endif */}
      <SqlFormatterAndSubmitter
        currentSqlUploadType={currentUploadType}
        fieldPrefixPath={fieldPrefixPath}
        isAuditing={isAuditing}
        auditAction={auditAction}
        databaseInfo={databaseInfo}
        isSameSqlForAll={isSameSqlForAll}
        setActiveKey={setActiveKey}
      />
    </>
  );
};
export default SqlStatementFormItem;
