import { Form } from 'antd';
import { SqlAuditInfoFormItemProps } from '../index.type';
import DatabaseSelectionItem from './DatabaseSelectionItems';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BasicSwitch } from '@actiontech/shared';
import { useEffect, useMemo } from 'react';
import {
  CreateWorkflowDatabaseInfo,
  SqlAuditInfoFormFields
} from '../../../../index.type';
import SqlStatementFormController from '../../../../../Common/SqlStatementFormController';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import { RingPieFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { forwardRef } from 'react';

const SqlAuditInfoFormItem = forwardRef<HTMLElement, SqlAuditInfoFormItemProps>(
  ({ auditAction, handleInstanceNameChange, ...sharedStepDetail }, ref) => {
    const { t } = useTranslation();
    const form = Form.useFormInstance<SqlAuditInfoFormFields>();

    const isSameSqlForAll = Form.useWatch('isSameSqlForAll', form);

    const databaseInfo: CreateWorkflowDatabaseInfo = useMemo(() => {
      return Object.keys(sharedStepDetail.dbSourceInfoCollection.value)
        .map((key) => {
          return {
            key,
            instanceName:
              sharedStepDetail.dbSourceInfoCollection.value?.[key]
                ?.instanceName,
            schemaName:
              sharedStepDetail.dbSourceInfoCollection.value?.[key]?.schemaName,
            enableBackup:
              sharedStepDetail.dbSourceInfoCollection.value?.[key]
                ?.enableBackup,
            allowBackup:
              sharedStepDetail.dbSourceInfoCollection.value?.[key]?.allowBackup,
            backupMaxRows:
              sharedStepDetail.dbSourceInfoCollection.value?.[key]
                ?.backupMaxRows
          };
        })
        .filter((v) => !!v.instanceName);
    }, [sharedStepDetail.dbSourceInfoCollection]);

    const isSupportFileModeExecuteSqlRecord: Record<string, boolean> =
      useMemo(() => {
        if (isSameSqlForAll) {
          // 相同 SQL 模式下，判断所有数据源是否都支持。虽然 相同 SQL 模式下所有数据源类型会相同，但还是做下校验
          return {
            [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: Object.keys(
              sharedStepDetail.dbSourceInfoCollection.value
            ).every((key) => {
              return !!sharedStepDetail.dbSourceInfoCollection?.value?.[key]
                ?.isSupportFileModeExecuteSql;
            })
          };
        }
        //不同 SQL 模式下，每个数据源对应各自当前数据源类型是否支持文件上线模式
        return Object.keys(
          sharedStepDetail.dbSourceInfoCollection.value
        ).reduce((acc, key) => {
          return {
            ...acc,
            [key]:
              !!sharedStepDetail.dbSourceInfoCollection?.value?.[key]
                ?.isSupportFileModeExecuteSql
          };
        }, {});
      }, [isSameSqlForAll, sharedStepDetail.dbSourceInfoCollection.value]);

    useEffect(() => {
      const dbTypeSet = new Set(
        Object.keys(sharedStepDetail.dbSourceInfoCollection.value)
          ?.map((key) => {
            return sharedStepDetail.dbSourceInfoCollection.value?.[key].dbType;
          })
          .filter((v) => !!v)
      );
      if (dbTypeSet.size > 1) {
        form.setFieldValue('isSameSqlForAll', false);
        sharedStepDetail.isDisabledForDifferenceSql.set(true);
      } else {
        sharedStepDetail.isDisabledForDifferenceSql.set(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, sharedStepDetail.dbSourceInfoCollection.value]);

    return (
      <>
        <section ref={ref}>
          <DatabaseSelectionItem
            {...sharedStepDetail}
            handleInstanceNameChange={handleInstanceNameChange}
          />
        </section>

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
                <CommonIconStyleWrapper className="custom-icon-ellipse">
                  <RingPieFilled />
                </CommonIconStyleWrapper>
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
          <BasicSwitch
            disabled={sharedStepDetail.isDisabledForDifferenceSql.value}
          />
        </FormItemLabel>

        <SqlStatementFormController
          activeKey={sharedStepDetail.sqlStatementTabActiveKey.value}
          onChange={sharedStepDetail.sqlStatementTabActiveKey.set}
          auditAction={auditAction}
          isSameSqlForAll={isSameSqlForAll}
          databaseInfo={databaseInfo}
          isAuditing={sharedStepDetail.isAuditing}
          isSupportFileModeExecuteSqlRecord={isSupportFileModeExecuteSqlRecord}
          isAtFormStep={sharedStepDetail.isAtFormStep}
        />
      </>
    );
  }
);

export default SqlAuditInfoFormItem;
