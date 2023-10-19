import { AuditResultForCreateOrderProps } from './index.type';
import BasicInfoWrapper from '../../Common/BasicInfoWrapper';
import AuditResultList from '../../Common/AuditResultList';

export const AuditResultForCreateOrder: React.FC<
  AuditResultForCreateOrderProps
> = ({ tasks, baseInfo, projectID, updateTaskRecordTotalNum }) => {
  return (
    <>
      <BasicInfoWrapper
        title={baseInfo?.workflow_subject ?? ''}
        desc={baseInfo?.desc}
      />

      <AuditResultList
        tasks={tasks}
        updateTaskRecordTotalNum={updateTaskRecordTotalNum}
        projectID={projectID}
      />
    </>
  );
};

export default AuditResultForCreateOrder;
