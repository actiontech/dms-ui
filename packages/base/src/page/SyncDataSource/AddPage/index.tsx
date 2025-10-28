import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useCallback, useEffect } from 'react';
import { Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import SyncTaskForm from '../Form';
import {
  BasicButton,
  BasicResult,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/dms-kit';
import { BackButton } from '@actiontech/shared';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/dms-kit';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { DatabaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';
import DBServiceSyncTaskService from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask';
import { IAddDBServiceSyncTaskParams } from '@actiontech/shared/lib/api/base/service/DBServiceSyncTask/index.d';
import { useAsyncParams } from '@actiontech/shared';
import useTaskSource from '../../../hooks/useTaskSource';
import { SyncTaskFormFields } from '../Form/index.type';
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
    const additionalParams = taskSourceTips.generateTaskSourceAdditionalParams(
      values.source
    );
    const params: IAddDBServiceSyncTaskParams = {
      db_service_sync_task: {
        name: values.name,
        db_type: values.instanceType,
        source: values.source,
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
          <BackButton>
            {t('dmsSyncDataSource.addSyncTask.backToList')}
          </BackButton>
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
            <BackButton icon={null} type="primary" key="view-sync-task">
              {t('dmsSyncDataSource.addSyncTask.successGuide')}
            </BackButton>
          ]}
        />
      </LazyLoadComponent>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};
export default AddSyncTask;
