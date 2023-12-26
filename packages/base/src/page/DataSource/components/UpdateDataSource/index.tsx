import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useNavigate, useParams } from 'react-router-dom';

import { useCallback, useEffect, useState } from 'react';
import { Button, message, Empty, Typography, Spin } from 'antd';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import DataSourceForm from '../Form';

import { useForm } from 'antd/es/form/Form';
import { ResponseCode } from '@actiontech/shared/lib/enum';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';

import dms from '@actiontech/shared/lib/api/base/service/dms';
import { DataSourceFormField } from '../Form/index.type';
import { IListDBService } from '@actiontech/shared/lib/api/base/service/common';
import { UpdateDataSourceUrlParams } from './index.type';
import { IUpdateDBServiceParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';

const UpdateDataSource = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const [initError, setInitError] = useState('');
  const [form] = useForm<DataSourceFormField>();
  const urlParams = useParams<UpdateDataSourceUrlParams>();

  const [retryLoading, setRetryLoading] = useState(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [instanceInfo, setInstanceInfo] = useState<
    IListDBService | undefined
  >();

  const updateDatabase = async (values: DataSourceFormField) => {
    startSubmit();
    const params: IUpdateDBServiceParams = {
      db_service_uid: urlParams.dbServiceUid ?? '',
      db_service: {
        business: values.business,
        db_type: values.type,
        desc: values.describe,
        host: values.ip,
        maintenance_times:
          values.maintenanceTime?.map((t) => ({
            maintenance_start_time: t.startTime,
            maintenance_stop_time: t.endTime
          })) ?? [],
        port: `${values.port}`,
        sqle_config: {
          rule_template_id: values.ruleTemplateId,
          rule_template_name: values.ruleTemplateName,
          sql_query_config: {
            allow_query_when_less_than_audit_level:
              values.allowQueryWhenLessThanAuditLevel,
            audit_enabled: values.needAuditForSqlQuery
          }
        },
        additional_params: values.asyncParams,
        user: values.user
      },
      project_uid: projectID
    };

    if (!!values.needUpdatePassword && !!values.password && params.db_service) {
      params.db_service.password = values.password;
    }

    return dms
      .UpdateDBService(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataSource.updateDatabase.updateDatabaseSuccess', {
              name: values.name
            })
          );
          navigate(`/project/${projectID}/db-services`, { replace: true });
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onSubmitForm = async () => {
    EventEmitter.emit(EmitterKey.DMS_Submit_DataSource_Form);
  };

  const getInstanceInfo = useCallback(() => {
    setRetryLoading(true);
    dms
      .ListDBServices({
        filter_by_uid: urlParams.dbServiceUid ?? '',
        page_size: 9999,
        page_index: 1,
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const instance = res.data.data?.[0];
          setInstanceInfo({ ...instance, password: '' });
          setInitError('');
        } else {
          setInitError(res.data.message ?? t('common.unknownError'));
        }
      })
      .finally(() => {
        setRetryLoading(false);
      });
  }, [projectID, t, urlParams.dbServiceUid]);

  useEffect(() => {
    if (!!urlParams.dbServiceUid && !!projectID) {
      getInstanceInfo();
    }
  }, [getInstanceInfo, projectID, urlParams.dbServiceUid]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {messageContextHolder}
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
          <BasicButton
            type="primary"
            loading={submitLoading}
            onClick={() => onSubmitForm()}
          >
            {t('common.submit')}
          </BasicButton>
        }
      />
      <EmptyBox
        if={!initError}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <Typography.Text type="danger">
                {t('dmsDataSource.updateDatabase.getDatabaseInfoError')}:{' '}
                {initError}
              </Typography.Text>
            }
          >
            <Button
              type="primary"
              onClick={getInstanceInfo}
              loading={retryLoading}
            >
              {t('common.retry')}
            </Button>
          </Empty>
        }
      >
        <Spin spinning={retryLoading}>
          <DataSourceForm
            form={form}
            isUpdate={true}
            defaultData={instanceInfo}
            submit={updateDatabase}
          />
        </Spin>
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdateDataSource;
