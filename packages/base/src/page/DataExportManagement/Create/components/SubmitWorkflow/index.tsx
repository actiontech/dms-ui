import { useCurrentProject } from '@actiontech/shared/lib/global';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { useCallback, useEffect, useState } from 'react';
import UpdateInfoDrawer from './UpdateInfoDrawer';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BackToWorkflowList from '../../../Common/BackToWorkflowList';
import { Space } from 'antd';
import { ModalName } from '../../../../../data/ModalName';
import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import AuditResultList from '../../../Common/AuditResultList';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { CreateDataExportPageEnum } from '../../../../../store/dataExport';
import useCheckTaskAuditRuleExceptionStatus from '../../hooks/useCheckTaskAuditRuleExceptionStatus';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import SubmitWorkflowButton from './SubmitWorkflowButton';

const SubmitExportWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const {
    formValues,
    initModalStatus,
    submitLoading,
    updateModalStatus,
    updateSubmitLoading,
    taskIDs,
    updatePageState,
    updateWorkflowID
  } = useCreateDataExportReduxManage();
  const { projectID } = useCurrentProject();

  const [executeSQLsIsDQL, updateExecuteSQLsTypeIsDQL] = useState(true);

  const {
    hasExceptionAuditRule,
    updateTaskAuditRuleExceptionStatus,
    resetTaskAuditRuleExceptionStatus
  } = useCheckTaskAuditRuleExceptionStatus();

  const onSuccessGetDataExportTaskSqls = useCallback(
    (taskSqls: IListDataExportTaskSQL[]) => {
      updateTaskAuditRuleExceptionStatus(taskSqls);
      updateExecuteSQLsTypeIsDQL?.(
        taskSqls?.every((item) => item.export_sql_type === 'dql')
      );
    },
    [updateTaskAuditRuleExceptionStatus]
  );

  const onErrorGetDataExportTaskSqls = useCallback(() => {
    resetTaskAuditRuleExceptionStatus();
    updateExecuteSQLsTypeIsDQL(true);
  }, [resetTaskAuditRuleExceptionStatus]);

  const onSubmit = () => {
    updateSubmitLoading(true);
    DataExportWorkflows.AddDataExportWorkflow({
      project_uid: projectID,
      data_export_workflow: {
        name: formValues?.baseValues.workflow_subject ?? '',
        desc: formValues?.baseValues.desc,
        tasks: taskIDs?.map((v) => ({ task_uid: v ?? '' })) ?? []
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          updateWorkflowID(res.data.data?.export_data_workflow_uid ?? '');
          updatePageState(CreateDataExportPageEnum.SUBMIT_RESULT);
        }
      })
      .finally(() => {
        updateSubmitLoading(false);
      });
  };

  useEffect(() => {
    initModalStatus();
  }, [initModalStatus]);

  return (
    <>
      <PageHeader
        title={<BackToWorkflowList />}
        extra={
          <Space>
            <BasicButton
              onClick={() => {
                updateModalStatus({
                  modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
                  status: true
                });
              }}
              disabled={submitLoading}
            >
              {t('dmsDataExport.create.update.updateInfoAction')}
            </BasicButton>

            <SubmitWorkflowButton
              loading={submitLoading}
              onClick={onSubmit}
              hasExceptionAuditRule={hasExceptionAuditRule}
              executeSQLsIsDQL={executeSQLsIsDQL}
            />
          </Space>
        }
      />
      <BasicInfoWrapper
        title={formValues?.baseValues?.workflow_subject ?? ''}
        desc={formValues?.baseValues?.desc}
      />

      <AuditResultList
        projectID={projectID}
        taskIDs={taskIDs ?? []}
        onErrorGetDataExportTaskSqls={onErrorGetDataExportTaskSqls}
        onSuccessGetDataExportTaskSqls={onSuccessGetDataExportTaskSqls}
      />

      <UpdateInfoDrawer />
    </>
  );
};

export default SubmitExportWorkflow;
