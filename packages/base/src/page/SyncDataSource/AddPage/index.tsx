import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback } from 'react';

import { Link } from 'react-router-dom';
import { Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import SyncTaskForm, { SyncTaskFormFields } from '../Form';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IAddDatabaseSourceServiceParams } from '@actiontech/shared/lib/api/base/service/dms/index.d';

import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { LeftArrowOutlined, DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';

const AddSyncTask: React.FC = () => {
  const { t } = useTranslation();

  const { projectID, projectName } = useCurrentProject();
  const [form] = useForm<SyncTaskFormFields>();

  const [
    submitResultVisibility,
    { setTrue: showResult, setFalse: hiddenResult }
  ] = useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    const params: IAddDatabaseSourceServiceParams = {
      database_source_service: {
        name: values.name,
        db_type: values.instanceType,
        source: values.source,
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
          <Link to={`/project/${projectID}/sync-data-source`}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsSyncDataSource.addSyncTask.backToList')}
            </BasicButton>
          </Link>
        }
        extra={
          <EmptyBox if={!submitResultVisibility}>
            <Space>
              <BasicButton
                onClick={resetAndHideResult}
                disabled={submitLoading}
              >
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
          </EmptyBox>
        }
      />
      <EmptyBox
        if={submitResultVisibility}
        defaultNode={
          <SyncTaskForm
            projectName={projectName}
            loading={submitLoading}
            form={form}
            title={
              <>
                <Icon component={DatabaseFilled} className="title-icon" />
                <span>{t('dmsSyncDataSource.addSyncTask.title')}</span>
              </>
            }
          />
        }
      >
        <BasicResult
          status="success"
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
              <Link to={`/project/${projectID}/sync-data-source`}>
                {t('dmsSyncDataSource.addSyncTask.successGuide')}
              </Link>
            </BasicButton>
          ]}
        />
      </EmptyBox>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddSyncTask;
