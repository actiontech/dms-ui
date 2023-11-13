import { Empty, message, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SyncTaskForm, { SyncTaskFormFields } from '../SyncTaskForm';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
import { IUpdateDatabaseSourceServiceParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useBoolean } from 'ahooks';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { IconInstanceManager } from '../../../icon/sideMenu';

const UpdateSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const { taskId } = useParams<{ taskId: string }>();
  const [initError, setInitError] = useState('');
  const navigate = useNavigate();
  const [retryLoading, setRetryLoading] = useState(false);
  const { projectID, projectName } = useCurrentProject();
  const [finishGetSyncInstanceTask, setFinishGetSyncInstanceTask] =
    useState(false);
  const [syncInstanceTask, setSyncInstanceTask] = useState<
    IListDatabaseSourceService | undefined
  >();
  const [messageApi, contextHoler] = message.useMessage();

  const submit = async () => {
    const values: SyncTaskFormFields = await form.validateFields();
    startSubmit();
    const params: IUpdateDatabaseSourceServiceParams = {
      database_source_service_uid: taskId ?? '',
      database_source_service: {
        name: values.name,
        source: values.source,
        db_type: values.instanceType,
        sqle_config: {
          rule_template_id: values.ruleTemplateId,
          rule_template_name: values.ruleTemplateName
        },
        cron_express: values.syncInterval,
        url: values.url,
        version: values.version
      },
      project_uid: projectID
    };
    dms
      .UpdateDatabaseSourceService(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsSyncDataSource.updateSyncTask.successTips'));
          navigate(`/project/${projectID}/syncDataSource`, { replace: true });
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  const getSyncInstanceTask = useCallback(() => {
    if (!taskId) return;

    setRetryLoading(true);
    dms
      .GetDatabaseSourceService({
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
        setRetryLoading(false);
        setFinishGetSyncInstanceTask(true);
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
          <Link to={`/project/${projectID}/syncDataSource`}>
            <BasicButton icon={<IconLeftArrow />}>
              {t('dmsSyncDataSource.addSyncTask.backToList')}
            </BasicButton>
          </Link>
        }
        extra={
          <Space>
            <BasicButton onClick={reset}>{t('common.reset')}</BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
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
              loading={retryLoading}
            >
              {t('common.retry')}
            </BasicButton>
          </Empty>
        }
      >
        <SyncTaskForm
          loading={!finishGetSyncInstanceTask || submitLoading}
          defaultValue={syncInstanceTask}
          form={form}
          projectName={projectName}
          title={
            <>
              <IconInstanceManager
                className="title-icon"
                width={32}
                height={32}
              />
              <span>{t('dmsSyncDataSource.updateSyncTask.title')}</span>
            </>
          }
        />
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default UpdateSyncTask;
