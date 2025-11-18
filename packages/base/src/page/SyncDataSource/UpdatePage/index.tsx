import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback, useEffect, useState } from 'react';
import { Empty, message, Space, Typography } from 'antd';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/dms-kit';
import {
  BackButton,
  useTypedNavigate,
  useTypedParams
} from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { useForm } from 'antd/es/form/Form';
import SyncTaskForm from '../Form';
import { ResponseCode } from '@actiontech/dms-kit';
import { IGetDBServiceSyncTask } from '@actiontech/shared/lib/api/base/service/common';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import { DataSourceManagerSegmentedKey } from '../../DataSourceManagement/index.type';
import DBServiceSyncTaskService from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask';
import { IUpdateDBServiceSyncTaskParams } from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask/index.d';
import useTaskSource from '../../../hooks/useTaskSource';
import { useAsyncParams } from '@actiontech/shared';
import { SyncTaskFormFields } from '../Form/index.type';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const UpdateSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [messageApi, contextHoler] = message.useMessage();
  const [form] = useForm<SyncTaskFormFields>();
  const { updateTaskSourceList, ...taskSourceTips } = useTaskSource();
  const { mergeFromValueIntoParams } = useAsyncParams();
  const { taskId } =
    useTypedParams<typeof ROUTE_PATHS.BASE.SYNC_DATA_SOURCE.update>();
  const [initError, setInitError] = useState('');
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [taskInfoLoading, setTaskInfoLoading] = useState(false);
  const [syncInstanceTask, setSyncInstanceTask] =
    useState<IGetDBServiceSyncTask>();
  const onSubmit = async () => {
    const values: SyncTaskFormFields = await form.validateFields();
    startSubmit();
    const additionalParams = taskSourceTips.generateTaskSourceAdditionalParams(
      values.source
    );
    const params: IUpdateDBServiceSyncTaskParams = {
      db_service_sync_task_uid: taskId ?? '',
      db_service_sync_task: {
        name: values.name,
        source: values.source,
        db_type: values.instanceType,
        // #if [sqle]
        sqle_config: {
          audit_enabled: values.needSqlAuditService,
          rule_template_id: values.ruleTemplateId,
          rule_template_name: values.ruleTemplateName,
          data_export_rule_template_id: values.dataExportRuleTemplateId,
          data_export_rule_template_name: values.dataExportRuleTemplateName,
          sql_query_config: {
            audit_enabled: values.needAuditForSqlQuery,
            allow_query_when_less_than_audit_level:
              values.allowQueryWhenLessThanAuditLevel,
            rule_template_id: values.workbenchTemplateId,
            rule_template_name: values.workbenchTemplateName
          }
        },
        // #endif
        cron_express: values.syncInterval,
        url: values.url,
        additional_params: mergeFromValueIntoParams(
          values.params,
          additionalParams ?? []
        )
      }
    };
    DBServiceSyncTaskService.UpdateDBServiceSyncTask(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsSyncDataSource.updateSyncTask.successTips'));
          navigate(ROUTE_PATHS.BASE.DATA_SOURCE_MANAGEMENT.index, {
            queries: {
              active: DataSourceManagerSegmentedKey.SyncDataSource
            },
            replace: true
          });
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  const getSyncInstanceTask = useCallback(() => {
    if (!taskId) {
      setInitError(t('common.unknownError'));
      return;
    }
    setTaskInfoLoading(true);
    DBServiceSyncTaskService.GetDBServiceSyncTask({
      db_service_sync_task_uid: taskId
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSyncInstanceTask(res.data?.data);
          setInitError('');
        } else {
          setInitError(res.data?.message ?? t('common.unknownError'));
        }
      })
      .finally(() => {
        setTaskInfoLoading(false);
      });
  }, [t, taskId]);
  const reset = () => {
    EventEmitter.emit(EmitterKey.DMS_SYNC_TASK_RESET_FORM);
  };
  useEffect(() => {
    getSyncInstanceTask();
    updateTaskSourceList();
  }, [getSyncInstanceTask, updateTaskSourceList]);
  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {contextHoler}
      <PageHeader
        fixed
        title={
          <BackButton>
            {t('dmsSyncDataSource.addSyncTask.backToList')}
          </BackButton>
        }
        extra={
          <Space>
            <BasicButton onClick={reset} disabled={submitLoading}>
              {t('common.reset')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      />

      <EmptyBox
        if={!initError}
        defaultNode={
          <Empty
            style={{
              marginTop: 160
            }}
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            description={
              <Typography.Text type="danger">
                {t('dmsSyncDataSource.updateSyncTask.getSyncInstanceTaskError')}
                : {initError}
              </Typography.Text>
            }
          >
            <BasicButton
              type="primary"
              onClick={getSyncInstanceTask}
              loading={taskInfoLoading}
            >
              {t('common.retry')}
            </BasicButton>
          </Empty>
        }
      >
        <SyncTaskForm
          taskSourceTips={taskSourceTips}
          form={form}
          loading={taskInfoLoading || submitLoading}
          defaultValue={syncInstanceTask}
          title={
            <>
              <Icon component={DatabaseFilled} className="title-icon" />
              <span>{t('dmsSyncDataSource.updateSyncTask.title')}</span>
            </>
          }
        />
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};
export default UpdateSyncTask;
