import { Spin } from 'antd';
import { WorkflowDetailStyleWrapper } from './style';
import BackToWorkflowList from '../Common/BackToWorkflowList';
import { EmptyBox, PageHeader } from '@actiontech/dms-kit';
import { useEffect, useMemo } from 'react';
import useDataExportDetailReduxManage from './hooks/index.redux';
import BasicInfoWrapper from '../Common/BasicInfoWrapper';
import useInitDataWithRequest from './hooks/useInitDataWithRequest';
import {
  WorkflowRecordStatusEnum,
  WorkflowStepStateEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import RejectReason from './components/RejectReason';
import ExportDetail from './components/ExportDetail';
import ExportDetailPageHeaderAction from './components/PageHeaderAction';
import WorkflowRecordInfo from './components/WorkflowRecordInfo';
import RejectWorkflowModal from './components/RejectReason/RejectWorkflowModal';
const WorkflowDetail: React.FC = () => {
  const { clearAllDetailState, workflowInfo, workflowStepOpen } =
    useDataExportDetailReduxManage();
  const { getTaskInfosLoading, getWorkflowLoading } = useInitDataWithRequest();
  const currentRejectedStep = useMemo(() => {
    return workflowInfo?.workflow_record?.workflow_step_list?.find(
      (v) => v.state === WorkflowStepStateEnum.rejected
    );
  }, [workflowInfo?.workflow_record?.workflow_step_list]);
  useEffect(() => {
    return () => {
      clearAllDetailState();
    };
  }, [clearAllDetailState]);
  return (
    <Spin spinning={getTaskInfosLoading || getWorkflowLoading}>
      <WorkflowDetailStyleWrapper workflowStepOpen={workflowStepOpen}>
        <section className="workflow-detail-content">
          <PageHeader
            title={<BackToWorkflowList />}
            extra={<ExportDetailPageHeaderAction />}
          />

          <BasicInfoWrapper
            title={workflowInfo?.workflow_name ?? ''}
            desc={workflowInfo?.desc}
            status={workflowInfo?.workflow_record?.status}
            className="clearPaddingTop"
            gap={24}
          />

          <EmptyBox
            if={
              workflowInfo?.workflow_record?.status ===
                WorkflowRecordStatusEnum.rejected && !!currentRejectedStep
            }
          >
            <RejectReason stepInfo={currentRejectedStep!} />
          </EmptyBox>

          <ExportDetail />
        </section>

        <WorkflowRecordInfo />
      </WorkflowDetailStyleWrapper>

      <RejectWorkflowModal />
    </Spin>
  );
};
export default WorkflowDetail;
