import { useTranslation } from 'react-i18next';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import SortableSqlFilesModal from './SortableSqlFilesModal';
import { useBoolean } from 'ahooks';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { FileModeHeaderProps } from './index.type';
import { RingPieFilled } from '@actiontech/icons';

const FileModeHeader: React.FC<FileModeHeaderProps> = ({
  taskId,
  refresh,
  allowExec
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
        <RingPieFilled className="custom-icon-ellipse" />
        <Typography.Text className="file-mode-title-text">
          {t('execWorkflow.audit.fileModeExecute.headerTitle')}
        </Typography.Text>
      </div>

      {/* #if [ee] */}
      <EmptyBox if={allowExec}>
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
      {/* #endif */}
    </div>
  );
};

export default FileModeHeader;
