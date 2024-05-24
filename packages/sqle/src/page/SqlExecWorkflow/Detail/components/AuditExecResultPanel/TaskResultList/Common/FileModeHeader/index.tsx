import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import SortableSqlFilesModal from '../SortableSqlFilesModal';
import { useBoolean } from 'ahooks';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FileModeHeaderProps } from './index.type';

const FileModeHeader: React.FC<FileModeHeaderProps> = ({
  taskId,
  refresh,
  workflowStatus
}) => {
  const { t } = useTranslation();
  const { workflowId } = useParams<{ workflowId: string }>();

  const [
    sortableSQLFilesModalOpen,
    { setFalse: closeSortableSQLFilesModal, setTrue: openSortableSQLFilesModal }
  ] = useBoolean(false);

  return (
    <div className="file-mode-title flex-space-between full-width-element">
      <div className="flex-display flex-align-center">
        <IconEllipse />
        <Typography.Text className="file-mode-title-text">
          {t('execWorkflow.audit.fileModeExecute.headerTitle')}
        </Typography.Text>
      </div>

      <EmptyBox
        if={workflowStatus === WorkflowRecordResV2StatusEnum.wait_for_execution}
      >
        <BasicButton onClick={openSortableSQLFilesModal} type="primary">
          {t('execWorkflow.audit.fileModeExecute.extraButtonText')}
        </BasicButton>

        <SortableSqlFilesModal
          workflowId={workflowId ?? ''}
          refresh={refresh}
          open={sortableSQLFilesModalOpen}
          onClose={closeSortableSQLFilesModal}
          taskId={taskId}
        />
      </EmptyBox>
    </div>
  );
};

export default FileModeHeader;
