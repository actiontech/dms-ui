import { useCurrentProject } from '@actiontech/shared/lib/global';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { useEffect, useState } from 'react';
import UpdateInfoDrawer from './UpdateInfoDrawer';
import {
  BasicButton,
  BasicToolTips,
  EmptyBox,
  PageHeader
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BackToWorkflowList from '../../../Common/BackToWorkflowList';
import { Space } from 'antd';
import { ModalName } from '../../../../../data/ModalName';
import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import AuditResultList from '../../../Common/AuditResultList';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { CreateDataExportPageEnum } from '../../../../../store/dataExport';

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

  const submit = () => {
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

            <EmptyBox
              if={executeSQLsIsDQL}
              defaultNode={
                <BasicToolTips
                  title={t('dmsDataExport.create.update.submitTips')}
                >
                  <BasicButton disabled={true} type="primary">
                    {t('dmsDataExport.create.update.submitAction')}
                  </BasicButton>
                </BasicToolTips>
              }
            >
              <BasicButton
                disabled={submitLoading}
                type="primary"
                onClick={submit}
              >
                {t('dmsDataExport.create.update.submitAction')}
              </BasicButton>
            </EmptyBox>
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
        updateExecuteSQLsTypeIsDQL={updateExecuteSQLsTypeIsDQL}
      />

      <UpdateInfoDrawer />
    </>
  );
};

export default SubmitExportWorkflow;
