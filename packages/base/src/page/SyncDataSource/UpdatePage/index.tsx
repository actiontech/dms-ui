import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Empty, message, Space, Typography } from 'antd';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

import DatabaseSourceService from '@actiontech/shared/lib/api/base/service/DatabaseSourceService';
import { useForm } from 'antd/es/form/Form';
import SyncTaskForm, { SyncTaskFormFields } from '../Form';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
import { IUpdateDatabaseSourceServiceParams } from '@actiontech/shared/lib/api/base/service/DatabaseSourceService/index.d';

import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { LeftArrowOutlined, DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';

const UpdateSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projectID, projectName } = useCurrentProject();
  const [messageApi, contextHoler] = message.useMessage();
  const [form] = useForm<SyncTaskFormFields>();

  const { taskId } = useParams<{ taskId: string }>();
  const [initError, setInitError] = useState('');
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [taskInfoLoading, setTaskInfoLoading] = useState(false);
  const [syncInstanceTask, setSyncInstanceTask] = useState<
    IListDatabaseSourceService | undefined
  >();

  const onSubmit = async () => {
    const values: SyncTaskFormFields = await form.validateFields();
    startSubmit();
    const params: IUpdateDatabaseSourceServiceParams = {
      database_source_service_uid: taskId ?? '',
      database_source_service: {
        name: values.name,
        source: values.source,
        db_type: values.instanceType,
        // #if [sqle]
        sqle_config: {
          rule_template_id: values.ruleTemplateId,
          rule_template_name: values.ruleTemplateName
        },
        // #endif
        cron_express: values.syncInterval,
        url: values.url,
        version: values.version
      },
      project_uid: projectID
    };
    DatabaseSourceService.UpdateDatabaseSourceService(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsSyncDataSource.updateSyncTask.successTips'),
            3,
            () => {
              navigate(`/project/${projectID}/sync-data-source`, {
                replace: true
              });
            }
          );
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
    DatabaseSourceService.GetDatabaseSourceService({
      database_source_service_uid: taskId,
      project_uid: projectID
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
  }, [projectID, t, taskId]);

  const reset = () => {
    EventEmitter.emit(EmitterKey.DMS_SYNC_TASK_RESET_FORM);
  };

  useEffect(() => {
    getSyncInstanceTask();
  }, [getSyncInstanceTask]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      {contextHoler}
      <PageHeader
        fixed
        title={
          <Link to={`/project/${projectID}/sync-data-source`}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsSyncDataSource.addSyncTask.backToList')}
            </BasicButton>
          </Link>
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
          loading={taskInfoLoading || submitLoading}
          defaultValue={syncInstanceTask}
          form={form}
          projectName={projectName}
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
