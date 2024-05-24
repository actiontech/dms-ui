import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlFormatterAndSubmitterProps } from './index.type';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { SqlFiledInitialValue } from '../../../../../../data/common';
import { useBoolean } from 'ahooks';

const SqlFormatterAndSubmitter: React.FC<SqlFormatterAndSubmitterProps> = ({
  fieldPrefixPath,
  isAuditing,
  auditAction,
  databaseInfo,
  isSameSqlForAll
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const currentSqlUploadType = Form.useWatch(
    [fieldPrefixPath, 'currentUploadType'],
    form
  ) as AuditTaskResV1SqlSourceEnum;

  const [
    formatterLoading,
    { setFalse: finishFormatter, setTrue: startFormatter }
  ] = useBoolean();

  const internalSubmit = async () => {
    const values = await form.validateFields();
    auditAction(values);
  };

  const formatSql = async () => {
    const getInstanceType = (name: string) => {
      startFormatter();
      return instance
        .getInstanceV2({
          project_name: projectName,
          instance_name: name
        })
        .then((res) => res.data.data)
        .finally(() => {
          finishFormatter();
        });
    };
    const originSql = form.getFieldValue([fieldPrefixPath, 'form_data']);
    const instanceName = isSameSqlForAll
      ? databaseInfo[0].instanceName
      : databaseInfo.find((v) => v.key === fieldPrefixPath)?.instanceName;
    if (originSql && originSql !== SqlFiledInitialValue) {
      if (instanceName) {
        const dbType = (await getInstanceType(instanceName))?.db_type;
        form.setFieldValue(
          [fieldPrefixPath, 'form_data'],
          formatterSQL(originSql, dbType)
        );
      } else {
        form.setFieldValue(
          [fieldPrefixPath, 'form_data'],
          formatterSQL(originSql)
        );
      }
    }
  };
  return (
    <FormItemNoLabel>
      <Space size={12}>
        <BasicButton
          onClick={internalSubmit}
          type="primary"
          loading={isAuditing.value}
        >
          {t('execWorkflow.create.form.sqlInfo.audit')}
        </BasicButton>

        {currentSqlUploadType === AuditTaskResV1SqlSourceEnum.form_data && (
          <BasicToolTips
            suffixIcon
            title={t('execWorkflow.create.form.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          >
            <BasicButton
              onClick={formatSql}
              loading={isAuditing.value || formatterLoading}
            >
              {t('execWorkflow.create.form.sqlInfo.format')}
            </BasicButton>
          </BasicToolTips>
        )}
      </Space>
    </FormItemNoLabel>
  );
};

export default SqlFormatterAndSubmitter;
