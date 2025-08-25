import { useToggle } from 'ahooks';
import { WorkflowHistoryStepsProps } from '../index.type';
import { EmptyBox } from '@actiontech/dms-kit';
import { WorkflowHistoryStepsStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import WorkflowSteps from './WorkflowSteps';
import { DownOutlined, UpOutlined } from '@actiontech/icons';
const WorkflowHistorySteps: React.FC<WorkflowHistoryStepsProps> = ({
  recordHistoryList
}) => {
  const { t } = useTranslation();
  const [open, { toggle }] = useToggle();
  return (
    <WorkflowHistoryStepsStyleWrapper>
      <div className="history-steps-trigger-wrapper" onClick={toggle}>
        <span>{t('execWorkflow.detail.operator.history.title')}</span>
        {open ? <UpOutlined /> : <DownOutlined />}
      </div>

      <EmptyBox if={open}>
        {recordHistoryList?.map((v, i) => (
          <WorkflowSteps
            key={i}
            workflowSteps={v.workflow_step_list}
            currentStepNumber={v.current_step_number}
            workflowStatus={v.status}
          />
        ))}
      </EmptyBox>
    </WorkflowHistoryStepsStyleWrapper>
  );
};
export default WorkflowHistorySteps;
