import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import { Button, message, Empty, Typography, Spin } from 'antd';
import {
  BasicButton,
  EmptyBox,
  PageHeader,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import DataSourceForm from '../Form';
import { useForm } from 'antd/es/form/Form';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { DataSourceFormField } from '../Form/index.type';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { IUpdateDBServiceV2Params } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { DmsApi } from '@actiontech/shared/lib/api';

const UpdateDataSource = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const [initError, setInitError] = useState('');
  const [form] = useForm<DataSourceFormField>();
  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.BASE.DATA_SOURCE.update>();

  const [retryLoading, setRetryLoading] = useState(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [instanceInfo, setInstanceInfo] = useState<
    IListDBServiceV2 | undefined
  >();

  const updateDatabase = async (values: DataSourceFormField) => {
    startSubmit();
    const params: IUpdateDBServiceV2Params = {
      db_service_uid: urlParams.dbServiceUid ?? '',
      db_service: {
        environment_tag: {
          uid: values.environmentTagId
        },
        db_type: values.type,
        desc: values.describe,
        host: values.ip,
        maintenance_times:
          values.maintenanceTime?.map((time) => ({
            maintenance_start_time: time.startTime,
            maintenance_stop_time: time.endTime
          })) ?? [],
        port: `${values.port}`,
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
        user: values.user,
        // #if [dms]
        is_enable_masking: values.is_enable_masking,
        // #endif
        // #if [sqle && ee]
        enable_backup: values.enableBackup,
        backup_max_rows: values.backupMaxRows
        // #endif
      },
      project_uid: projectID
    };

    if (!!values.needUpdatePassword && !!values.password && params.db_service) {
      params.db_service.password = values.password;
    }

    return DmsApi.DBServiceService.UpdateDBServiceV2(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataSource.updateDatabase.updateDatabaseSuccess', {
              name: values.name
            })
          );
          const timeId = setTimeout(() => {
            clearTimeout(timeId);
            navigate(-1);
          }, 600);
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
    DmsApi.DBServiceService.ListDBServicesV2({
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
            onClick={() => navigate(-1)}
            icon={<LeftArrowOutlined />}
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
