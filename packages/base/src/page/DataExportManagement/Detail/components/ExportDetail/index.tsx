import { useTranslation } from 'react-i18next';
import { WorkflowDetailExportResultStyleWrapper } from './style';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, BasicSegmented, EmptyBox } from '@actiontech/shared';
import useDataExportDetailReduxManage from '../../hooks/index.redux';
import OverviewList from './OverviewList';
import ExportTaskList from './ExportTaskList';
import DbServiceSegmentedLabel from '../../../Common/DbServiceSegmentedLabel';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import DataExportTask from '@actiontech/shared/lib/api/base/service/DataExportTask';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean } from 'ahooks';
import { PanelCardOutlined } from '@actiontech/icons';

const OVERVIEW_TAB_KEY = 'OVERVIEW_TAB_KEY';

const ExportDetail: React.FC = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { taskInfos, curTaskID, updateCurTaskID } =
    useDataExportDetailReduxManage();

  const generateCurrentTaskLabel = (
    dbServiceName?: string,
    auditLevel?: AuditTaskResV1AuditLevelEnum
  ) => {
    if (!dbServiceName) {
      return '-';
    }

    return (
      <DbServiceSegmentedLabel
        dbServiceName={dbServiceName}
        auditLevel={auditLevel}
      />
    );
  };

  const [
    downloadSQLsLoading,
    { setFalse: finishDownloadSQLs, setTrue: startDownloadSQLs }
  ] = useBoolean();
  const downloadSQLs = async () => {
    startDownloadSQLs();
    try {
      await DataExportTask.DownloadDataExportTaskSQLs({
        project_uid: projectID,
        data_export_task_uid: curTaskID ?? ''
      });
    } finally {
      finishDownloadSQLs();
    }
  };

  return (
    <WorkflowDetailExportResultStyleWrapper>
      <div className="export-result-title">
        {t('dmsDataExport.detail.exportResult.title')}
      </div>

      <SegmentedRowStyleWrapper justify="space-between">
        <BasicSegmented
          value={curTaskID ?? OVERVIEW_TAB_KEY}
          onChange={(value) => {
            if (value !== OVERVIEW_TAB_KEY) {
              updateCurTaskID(value as string);
            } else {
              updateCurTaskID(null);
            }
          }}
          options={[
            {
              value: OVERVIEW_TAB_KEY,
              label: t('dmsDataExport.detail.exportResult.overview.title')
            },
            ...(taskInfos ?? []).map((v) => ({
              value: `${v.task_uid}`,
              label: generateCurrentTaskLabel(
                v.db_info?.name,
                v.audit_result?.audit_level as AuditTaskResV1AuditLevelEnum
              )
            }))
          ]}
        />

        <BasicButton
          loading={downloadSQLsLoading}
          onClick={downloadSQLs}
          hidden={!curTaskID}
          icon={<PanelCardOutlined />}
        >
          {t('dmsDataExport.detail.exportResult.taskDetail.downloadSQL')}
        </BasicButton>
      </SegmentedRowStyleWrapper>

      <EmptyBox if={!!curTaskID} defaultNode={<OverviewList />}>
        <ExportTaskList />
      </EmptyBox>
    </WorkflowDetailExportResultStyleWrapper>
  );
};

export default ExportDetail;
