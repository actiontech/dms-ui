import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import SyncTaskForm, { SyncTaskFormFields } from '../Form';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { LeftArrowOutlined, DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import { DataSourceManagerSegmentedKey } from '../../DataSourceManagement/index.type';
import DBServiceSyncTaskService from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask';
import { IAddDBServiceSyncTaskParams } from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask/index.d';
import useAsyncParams from 'sqle/src/components/BackendForm/useAsyncParams';
import useTaskSource from '../../../hooks/useTaskSource';

const AddSyncTask: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm<SyncTaskFormFields>();
  const { mergeFromValueIntoParams } = useAsyncParams();

  const [
    submitResultVisibility,
    { setTrue: showResult, setFalse: hiddenResult }
  ] = useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const { updateTaskSourceList, ...taskSourceTips } = useTaskSource();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();

    const formParams = taskSourceTips.generateTaskSourceAdditionalParams(
      values.source
    );

    const params: IAddDBServiceSyncTaskParams = {
      name: values.name,
      db_type: values.instanceType,
      source: values.source,
      // #if [sqle]
      sqle_config: {
        rule_template_id: values.ruleTemplateId,
        rule_template_name: values.ruleTemplateName,
        sql_query_config: {
          audit_enabled: values.needAuditForSqlQuery,
          allow_query_when_less_than_audit_level:
            values.allowQueryWhenLessThanAuditLevel
        }
      },
      // #endif
      cron_express: values.syncInterval,
      url: values.url,
      additional_params: mergeFromValueIntoParams(
        values.params,
        formParams ?? []
      )
    };
    DBServiceSyncTaskService.AddDBServiceSyncTask(params)
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

  useEffect(() => {
    updateTaskSourceList();
  }, [updateTaskSourceList]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <Link
            to={`/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`}
          >
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

      <LazyLoadComponent open={!submitResultVisibility} animation={false}>
        <SyncTaskForm
          taskSourceTips={taskSourceTips}
          form={form}
          loading={submitLoading}
          title={
            <>
              <Icon component={DatabaseFilled} className="title-icon" />
              <span>{t('dmsSyncDataSource.addSyncTask.title')}</span>
            </>
          }
        />
      </LazyLoadComponent>

      <LazyLoadComponent open={submitResultVisibility} animation={false}>
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
              <Link
                to={`/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`}
              >
                {t('dmsSyncDataSource.addSyncTask.successGuide')}
              </Link>
            </BasicButton>
          ]}
        />
      </LazyLoadComponent>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default AddSyncTask;
