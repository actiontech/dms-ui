import { Form } from 'antd';
import { SqlAuditInfoFormItemProps } from '../index.type';
import DatabaseSelectionItem from './DatabaseSelectionItems';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { BasicSwitch } from '@actiontech/shared';
import { useEffect, useMemo } from 'react';
import { SqlAuditInfoFormFields } from '../../../../index.type';
import SqlStatementFormController from './SqlStatementFormController';
import SqlStatementFormItem from './SqlStatementFormItem';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from './SqlStatementFormItem/index.data';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import {
  getSystemModuleStatusDbTypeEnum,
  getSystemModuleStatusModuleNameEnum
} from '@actiontech/shared/lib/api/sqle/service/system/index.enum';

const SqlAuditInfoFormItem: React.FC<SqlAuditInfoFormItemProps> = ({
  isDisabledForDifferenceSql,
  ...props
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const isSameSqlForAll = Form.useWatch('isSameSqlForAll', form);
  const databaseInfo = useMemo(() => {
    return Object.keys(props.dbSourceInfoCollection.value)
      .map((key) => {
        return {
          key,
          instanceName: props.dbSourceInfoCollection.value?.[key]?.instanceName,
          schemaName: props.dbSourceInfoCollection.value?.[key]?.schemaName
        };
      })
      .filter((v) => !!v.instanceName);
  }, [props.dbSourceInfoCollection]);

  useEffect(() => {
    const dbTypeSet = new Set(
      Object.keys(props.dbSourceInfoCollection.value)
        ?.map((key) => {
          return props.dbSourceInfoCollection.value?.[key].dbType;
        })
        .filter((v) => !!v)
    );
    // #if [ee]
    const getSupportedFileModeByInstanceType = (types: string[]) => {
      Promise.all(
        types.map((type) => {
          return system.getSystemModuleStatus({
            db_type: type as getSystemModuleStatusDbTypeEnum,
            module_name:
              getSystemModuleStatusModuleNameEnum.execute_sql_file_mode
          });
        })
      ).then((res) => {
        props.isSupportFileModeExecuteSQL.set(
          res.every((item) => !!item.data.data?.is_supported)
        );
      });
    };
    if (dbTypeSet.size > 0) {
      getSupportedFileModeByInstanceType(Array.from(dbTypeSet) as string[]);
    }
    // #endif

    if (dbTypeSet.size > 1) {
      form.setFieldValue('isSameSqlForAll', false);
      isDisabledForDifferenceSql.set(true);
    } else {
      isDisabledForDifferenceSql.set(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, props.dbSourceInfoCollection.value]);

  return (
    <>
      <DatabaseSelectionItem {...props} />

      <FormItemLabel
        // #if [ce]
        hidden={true}
        // #endif
        name="isSameSqlForAll"
        valuePropName="checked"
        initialValue={true}
        className="has-label-tip"
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>
                {t('execWorkflow.create.form.sqlInfo.isSameSqlForAll')}
              </span>
            </div>
            <div className="tip-content-box">
              {t(
                'execWorkflow.create.form.sqlInfo.tipsDataSourceTypeForSameSql'
              )}
            </div>
          </div>
        }
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 2 }}
      >
        <BasicSwitch disabled={isDisabledForDifferenceSql.value} />
      </FormItemLabel>

      {/* #if [ee] */}
      <SqlStatementFormController
        activeKey={props.sqlStatementTabActiveKey.value}
        onChange={props.sqlStatementTabActiveKey.set}
        isSameSqlForAll={isSameSqlForAll}
        databaseInfo={databaseInfo}
        {...props}
      />
      {/* #elif [ce] */}
      <SqlStatementFormItem
        fieldPrefixPath={SAME_SQL_MODE_DEFAULT_FIELD_KEY}
        {...props}
      />
      {/* #endif */}
    </>
  );
};

export default SqlAuditInfoFormItem;
