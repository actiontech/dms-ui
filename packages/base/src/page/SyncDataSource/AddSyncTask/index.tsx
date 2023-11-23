import { useBoolean } from 'ahooks';
import { Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import SyncTaskForm, { SyncTaskFormFields } from '../SyncTaskForm';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAddDatabaseSourceServiceParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Link } from 'react-router-dom';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import { IconInstanceManager } from '../../../icon/sideMenu';

const AddSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();
  const [
    submitResultVisibility,
    { setTrue: showResult, setFalse: hiddenResult }
  ] = useBoolean();
  const { projectID, projectName } = useCurrentProject();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();

    const params: IAddDatabaseSourceServiceParams = {
      database_source_service: {
        name: values.name,
        db_type: values.instanceType,
        source: values.source,
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
      .AddDatabaseSourceService(params)
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
    hiddenResult();
    EventEmitter.emit(EmitterKey.DMS_SYNC_TASK_RESET_FORM);
  }, [hiddenResult]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
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
          <EmptyBox if={!submitResultVisibility}>
            <Space>
              <BasicButton onClick={resetAndHideResult}>
                {t('common.reset')}
              </BasicButton>
              <BasicButton
                type="primary"
                onClick={submit}
                loading={submitLoading}
              >
                {t('common.submit')}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />
      <div hidden={!submitResultVisibility}>
        <BasicResult
          icon={<IconSuccessResult />}
          title={t('dmsSyncDataSource.addSyncTask.successTips')}
          extra={[
            <BasicButton key="close" onClick={hiddenResult}>
              {t('common.close')}
            </BasicButton>,
            <BasicButton
              type="primary"
              key="resetAndClose"
              onClick={resetAndHideResult}
            >
              {t('common.resetAndClose')}
            </BasicButton>,
            <BasicButton type="primary" key="view-sync-task">
              <Link to={`/project/${projectID}/syncDataSource`}>
                {t('dmsSyncDataSource.addSyncTask.successGuide')}
              </Link>
            </BasicButton>
          ]}
        />
      </div>

      <div hidden={submitResultVisibility}>
        <SyncTaskForm
          projectName={projectName}
          loading={submitLoading}
          form={form}
          title={
            <>
              <IconInstanceManager
                className="title-icon"
                width={32}
                height={32}
              />
              <span>{t('dmsSyncDataSource.addSyncTask.title')}</span>
            </>
          }
        />
      </div>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddSyncTask;
