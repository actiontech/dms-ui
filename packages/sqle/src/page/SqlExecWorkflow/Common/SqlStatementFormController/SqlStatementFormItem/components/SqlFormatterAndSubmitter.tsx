import { BasicButton, BasicToolTip } from '@actiontech/dms-kit';
import { FormItemNoLabel } from '@actiontech/dms-kit';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { AuditTaskResV1SqlSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { SqlFormatterAndSubmitterProps } from './index.type';
import { FormatLanguageSupport, formatterSQL } from '@actiontech/dms-kit';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { SQL_EDITOR_PLACEHOLDER_VALUE } from '@actiontech/dms-kit';
import { FormValidateError } from '@actiontech/dms-kit/es/types/common.type';
import { SqlFormatterButtonStyleWrapper } from '../../../style';
import classNames from 'classnames';

const SqlFormatterAndSubmitter: React.FC<SqlFormatterAndSubmitterProps> = ({
  fieldPrefixPath,
  isAuditing,
  auditAction,
  databaseInfo,
  isSameSqlForAll,
  currentSqlUploadType,
  setActiveKey,
  dbSourceInfoCollection
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const currentFieldSqlIsFormatted = Form.useWatch(
    [fieldPrefixPath, 'formatted'],
    form
  );

  const [
    formatterLoading,
    { setFalse: finishFormatter, setTrue: startFormatter }
  ] = useBoolean();
  const internalSubmit = async () => {
    form
      .validateFields()
      .then((values) => {
        auditAction(values);
      })
      .catch((error: FormValidateError<SqlAuditInfoFormFields>) => {
        const errorField = error.errorFields.filter((i) => {
          return Object.keys(AuditTaskResV1SqlSourceEnum).some((v) => {
            return i.name.includes(v);
          });
        });
        if (!!errorField.length) {
          setActiveKey?.(errorField[0].name?.[0]);
        }
      });
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
      ? databaseInfo?.[0]?.instanceName
      : databaseInfo.find((v) => v.key === fieldPrefixPath)?.instanceName;
    if (originSql && originSql !== SQL_EDITOR_PLACEHOLDER_VALUE) {
      if (!currentFieldSqlIsFormatted) {
        form.setFieldValue([fieldPrefixPath, 'originSql'], originSql);
        form.setFieldValue([fieldPrefixPath, 'formatted'], true);
      }
      if (instanceName) {
        const dbType = (await getInstanceType(instanceName))?.db_type;
        // 判断当前数据库类型是否支持美化
        if (
          dbType &&
          dbSourceInfoCollection.value?.[fieldPrefixPath]?.isSupportFormatSql
        ) {
          // 如果是支持美化的数据库，则每次都进行美化
          form.setFieldValue(
            [fieldPrefixPath, 'form_data'],
            formatterSQL(originSql, dbType)
          );
        } else {
          // 如果是不支持美化的数据库，则美化过后再次美化，需要回滚回之前的原始sql
          if (currentFieldSqlIsFormatted) {
            form.setFieldValue(
              [fieldPrefixPath, 'form_data'],
              form.getFieldValue([fieldPrefixPath, 'originSql'])
            );
            form.setFieldValue([fieldPrefixPath, 'formatted'], false);
          } else {
            form.setFieldValue(
              [fieldPrefixPath, 'form_data'],
              formatterSQL(originSql)
            );
          }
        }
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
          <BasicToolTip
            suffixIcon
            title={t('execWorkflow.create.form.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          >
            <SqlFormatterButtonStyleWrapper
              onClick={formatSql}
              loading={isAuditing.value || formatterLoading}
              className={classNames({
                'active-formatter-button': currentFieldSqlIsFormatted
              })}
            >
              {t('execWorkflow.create.form.sqlInfo.format')}
            </SqlFormatterButtonStyleWrapper>
          </BasicToolTip>
        )}
      </Space>
    </FormItemNoLabel>
  );
};
export default SqlFormatterAndSubmitter;
