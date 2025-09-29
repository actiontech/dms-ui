import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback } from 'react';
import { useForm } from 'antd/es/form/Form';
import { Space, Typography } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import {
  BasicButton,
  PageHeader,
  BasicResult,
  EmptyBox
} from '@actiontech/dms-kit';
import { BackButton, useTypedNavigate } from '@actiontech/shared';
import DataSourceForm from '../Form';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { ResponseCode } from '@actiontech/dms-kit';
import { IDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { DataSourceFormField } from '../Form/index.type';
import { DmsApi } from '@actiontech/shared/lib/api';
import { DataSourceFormContextProvide } from '../../context';
import useCheckConnectable from '../../hooks/useCheckConnectable';
const AddDataSource = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [form] = useForm<DataSourceFormField>();
  const { onCheckConnectable, loading, connectAble, connectErrorMessage } =
    useCheckConnectable(form);
  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const addDatabase = async (values: DataSourceFormField) => {
    startSubmit();
    const dbService: IDBServiceV2 = {
      name: values.name,
      desc: values.describe,
      db_type: values.type,
      host: values.ip,
      port: values.port.toString(),
      user: values.user,
      password: values.password,
      environment_tag_uid: values.environmentTagId,
      maintenance_times:
        values.maintenanceTime?.map((time) => ({
          maintenance_start_time: time.startTime,
          maintenance_stop_time: time.endTime
        })) ?? [],
      // #if [sqle]
      sqle_config: {
        audit_enabled: values.needSqlAuditService,
        rule_template_id: values.ruleTemplateId,
        rule_template_name: values.ruleTemplateName,
        sql_query_config: {
          allow_query_when_less_than_audit_level:
            values.allowQueryWhenLessThanAuditLevel,
          audit_enabled: values.needAuditForSqlQuery,
          rule_template_id: values.workbenchTemplateId,
          rule_template_name: values.workbenchTemplateName
        }
      },
      // #endif
      additional_params: values.asyncParams,
      // #if [dms]
      is_enable_masking: values.is_enable_masking
      // #endif
    };
    // #if [sqle && ee]
    if (dbService.sqle_config) {
      dbService.sqle_config.data_export_rule_template_id =
        values.dataExportRuleTemplateId;
      dbService.sqle_config.data_export_rule_template_name =
        values.dataExportRuleTemplateName;
    }
    dbService.enable_backup = values.enableBackup;
    dbService.backup_max_rows = values.backupMaxRows;
    // #endif
    return DmsApi.DBServiceService.AddDBServiceV2({
      db_service: dbService,
      project_uid: values.project
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResult();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  const resetAndHideResult = useCallback(() => {
    hideResult();
    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);
  const onReset = () => {
    EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
  };
  const onSubmit = async () => {
    EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
  };
  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <DataSourceFormContextProvide
        value={{
          loading,
          connectAble,
          connectErrorMessage,
          onCheckConnectable,
          submitLoading
        }}
      >
        <PageHeader
          fixed
          title={<BackButton>{t('dmsDataSource.backDesc')}</BackButton>}
          extra={
            <Space hidden={resultVisible}>
              <BasicButton onClick={onReset}>{t('common.reset')}</BasicButton>
              <BasicButton
                type="primary"
                loading={submitLoading || loading}
                onClick={onSubmit}
              >
                {t('common.submit')}
              </BasicButton>
            </Space>
          }
        />
        <EmptyBox
          if={resultVisible}
          defaultNode={<DataSourceForm form={form} submit={addDatabase} />}
        >
          <BasicResult
            status="success"
            title={t('dmsDataSource.addDatabaseSuccess')}
            subTitle={
              <Typography.Link onClick={() => navigate(-1)}>
                {t('dmsDataSource.addDatabaseSuccessGuide')} {'>'}
              </Typography.Link>
            }
            extra={[
              <BasicButton
                type="primary"
                key="resetAndClose"
                onClick={resetAndHideResult}
              >
                {t('common.resetAndClose')}
              </BasicButton>
            ]}
          />
        </EmptyBox>
      </DataSourceFormContextProvide>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};
export default AddDataSource;
