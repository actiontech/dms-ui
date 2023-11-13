import { useCallback } from 'react';
import { Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { BasicButton, PageHeader, BasicResult } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import DataSourceForm from '../DataSourceForm';
import { DataSourceFormField } from '../DataSourceForm/index.type';

const AddDataSource = () => {
  const { t } = useTranslation();
  const [form] = useForm<DataSourceFormField>();
  const { projectID } = useCurrentProject();
  const navigate = useNavigate();

  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const addDatabase = async (values: DataSourceFormField) => {
    startSubmit();
    const dbService: IDBService = {
      name: values.name,
      desc: values.describe,
      db_type: values.type,
      host: values.ip,
      port: values.port.toString(),
      user: values.user,
      password: values.password,
      business: values.business,
      maintenance_times:
        values.maintenanceTime?.map((t) => ({
          maintenance_start_time: t.startTime,
          maintenance_stop_time: t.endTime
        })) ?? [],
      sqle_config: {
        rule_template_id: values.ruleTemplateId,
        rule_template_name: values.ruleTemplateName,
        sql_query_config: {
          allow_query_when_less_than_audit_level:
            values.allowQueryWhenLessThanAuditLevel,
          audit_enabled: values.needAuditForSqlQuery
        }
      },
      additional_params: values.asyncParams
    };
    return dms
      .AddDBService({ db_service: dbService, project_uid: projectID })
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
  }, [form, hideResult]);

  const onReset = () => {
    EventEmitter.emit(EmitterKey.DMS_Reset_DataSource_Form);
  };
  const onSubmit = async () => {
    EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <BasicButton
            onClick={() => navigate(`/project/${projectID}/db-services`)}
            icon={<IconLeftArrow />}
          >
            {t('dmsDataSource.backDesc')}
          </BasicButton>
        }
        extra={
          <Space hidden={resultVisible}>
            <BasicButton onClick={onReset}>{t('common.reset')}</BasicButton>
            <BasicButton
              type="primary"
              loading={submitLoading}
              onClick={onSubmit}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      />
      {resultVisible ? (
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('dmsDataSource.addDatabaseSuccess')}
          subTitle={
            <Link to={`/project/${projectID}/db-services`}>
              {t('dmsDataSource.addDatabaseSuccessGuide')} {'>'}
            </Link>
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
      ) : (
        <DataSourceForm form={form} submit={addDatabase} />
      )}
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddDataSource;
