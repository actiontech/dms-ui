import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';
import { Space } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  BasicButton,
  PageHeader,
  BasicResult,
  EmptyBox
} from '@actiontech/shared';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import DataSourceForm from '../Form';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';

import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
import { DataSourceFormField } from '../Form/index.type';
import { LeftArrowOutlined } from '@actiontech/icons';

const AddDataSource = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { projectID } = useCurrentProject();

  const [form] = useForm<DataSourceFormField>();

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
        values.maintenanceTime?.map((time) => ({
          maintenance_start_time: time.startTime,
          maintenance_stop_time: time.endTime
        })) ?? [],
      // #if [sqle]
      sqle_config: {
        rule_template_id: values.ruleTemplateId,
        rule_template_name: values.ruleTemplateName,
        sql_query_config: {
          allow_query_when_less_than_audit_level:
            values.allowQueryWhenLessThanAuditLevel,
          audit_enabled: values.needAuditForSqlQuery
        }
      },
      // #endif
      additional_params: values.asyncParams,
      // #if [dms]
      is_enable_masking: values.is_enable_masking
      // #endif
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
      <PageHeader
        fixed
        title={
          <BasicButton
            onClick={() => navigate(`/project/${projectID}/db-services`)}
            icon={<LeftArrowOutlined />}
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
      <EmptyBox
        if={resultVisible}
        defaultNode={<DataSourceForm form={form} submit={addDatabase} />}
      >
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
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddDataSource;
