import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { t } from '../../../../locale';
import { StatusStyleWrapper } from '../style';
import {
  CheckHexagonOutlined,
  AdvancedHexagonFilled,
  MinusCircleFilled,
  InfoHexagonOutlined
} from '@actiontech/icons';

const taskStatusMap = () => {
  return new Map<GetDataExportTaskStatusEnum, React.ReactNode>([
    [
      GetDataExportTaskStatusEnum.exporting,
      <>
        <AdvancedHexagonFilled />
        <span>{t('dmsDataExport.status.exporting')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.failed,
      <>
        <InfoHexagonOutlined />
        <span>{t('dmsDataExport.status.export_failed')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.finish,
      <>
        <CheckHexagonOutlined />
        <span>{t('dmsDataExport.status.finished')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.init,
      <>
        <AdvancedHexagonFilled />
        <span>{t('dmsDataExport.status.wait_for_export')}</span>
      </>
    ],
    [
      GetDataExportTaskStatusEnum.file_deleted,
      <>
        <MinusCircleFilled />
        <span>{t('dmsDataExport.status.file_deleted')}</span>
      </>
    ]
  ]);
};

const ExportTaskStatus: React.FC<{ status?: GetDataExportTaskStatusEnum }> = ({
  status
}) => {
  return (
    <>
      {status ? (
        <StatusStyleWrapper>{taskStatusMap().get(status)}</StatusStyleWrapper>
      ) : (
        'unknown'
      )}
    </>
  );
};

export default ExportTaskStatus;
