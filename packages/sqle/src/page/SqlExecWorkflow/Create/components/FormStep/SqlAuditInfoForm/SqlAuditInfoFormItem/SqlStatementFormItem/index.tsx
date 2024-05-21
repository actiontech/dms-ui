import { ModeSwitcher } from '@actiontech/shared';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { defaultUploadTypeOptions } from './index.data';
import { SqlStatementFormItemProps } from './index.type';
import { useMemo } from 'react';
import SqlUploadContent from './components/SqlUploadContent';
import { Form } from 'antd';
import { SqlAuditInfoFormProps } from '../../index.type';
import SqlExecModeSelector from './components/SqlExecModeSelector';
import SqlFormatterAndSubmitter from './components/SqlFormatterAndSubmitter';

const SqlStatementFormItem: React.FC<SqlStatementFormItemProps> = ({
  fieldPrefixPath,
  clearSqlContentFormWhenChangeUploadType = true,
  isAuditing,
  auditAction,
  isSupportFileModeExecuteSQL
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormProps>();

  const currentUploadTypeFieldName = useMemo(() => {
    return [fieldPrefixPath, 'currentUploadType'];
  }, [fieldPrefixPath]);

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
            <IconEllipse />
            <span>{t('execWorkflow.create.form.sqlInfo.uploadType')}</span>
          </>
        }
        className="form-item-label-mb-16"
      />

      <FormItemNoLabel
        name={currentUploadTypeFieldName}
        initialValue={defaultUploadTypeOptions[0].value}
      >
        <ModeSwitcher<AuditTaskResV1SqlSourceEnum>
          rowProps={{ gutter: 12 }}
          options={defaultUploadTypeOptions}
          onChange={uploadTypeChangeHandle}
        />
      </FormItemNoLabel>

      <SqlUploadContent fieldPrefixPath={fieldPrefixPath} />

      <SqlExecModeSelector
        fieldPrefixPath={fieldPrefixPath}
        isSupportFileModeExecuteSQL={isSupportFileModeExecuteSQL}
      />

      <SqlFormatterAndSubmitter
        fieldPrefixPath={fieldPrefixPath}
        isAuditing={isAuditing}
        auditAction={auditAction}
      />
    </>
  );
};

export default SqlStatementFormItem;
