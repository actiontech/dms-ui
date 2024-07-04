import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../../locale';
import { StatusStyleWrapper } from '../style';
import {
  HexagonOutlined,
  CheckHexagonOutlined,
  PartialHexagonFilled,
  AdvancedHexagonFilled,
  InfoHexagonOutlined,
  EmptyHexagonOutlined,
  CloseHexagonOutlined
} from '@actiontech/icons';

const workflowStatusMap = () => {
  return new Map<ListDataExportWorkflowStatusEnum, React.ReactNode>([
    [
      ListDataExportWorkflowStatusEnum.cancel,
      <>
        <CloseHexagonOutlined />
        <span>{t('dmsDataExport.status.canceled')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.exporting,
      <>
        <AdvancedHexagonFilled />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.finish,
      <>
        <CheckHexagonOutlined />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_export,
      <>
        <PartialHexagonFilled />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.failed,
      <>
        <InfoHexagonOutlined />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.wait_for_approve,
      <>
        <EmptyHexagonOutlined />
        <span>{t('dmsDataExport.status.wait_for_audit')}</span>
      </>
    ],
    [
      ListDataExportWorkflowStatusEnum.rejected,
      <>
        <HexagonOutlined />
        <span>{t('dmsDataExport.status.rejected')}</span>
      </>
    ]
  ]);
};

const WorkflowStatus: React.FC<{
  status?: ListDataExportWorkflowStatusEnum;
}> = ({ status }) => {
  return (
    <>
      {status ? (
        <StatusStyleWrapper>
          {workflowStatusMap().get(status)}
        </StatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default WorkflowStatus;
