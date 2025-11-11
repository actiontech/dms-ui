import { Form } from 'antd';
import { SqlAuditInfoFormItemProps } from '../index.type';
import DatabaseSelectionItem from './DatabaseSelectionItems';
import { FormItemLabel } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { BasicSwitch } from '@actiontech/dms-kit';
import { useEffect, useMemo } from 'react';
import {
  CreateWorkflowDatabaseInfo,
  SqlAuditInfoFormFields
} from '../../../../index.type';
import SqlStatementFormController from '../../../../../Common/SqlStatementFormController';
import { RingPieFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
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
              sharedStepDetail.dbSourceInfoCollection.value?.[key]?.schemaName
          };
        })
        .filter((v) => !!v.instanceName);
    }, [sharedStepDetail.dbSourceInfoCollection]);
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
          labelCol={{
            span: 22
          }}
          wrapperCol={{
            span: 2
          }}
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
          isAtFormStep={sharedStepDetail.isAtFormStep}
        />
      </>
    );
  }
);
export default SqlAuditInfoFormItem;
