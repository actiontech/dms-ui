import { ResponseCode } from '@actiontech/dms-kit';
import { GlobalDashboardService } from '@actiontech/shared/lib/api/sqle';
import {
  ExportGlobalWorkflowsV2ExportFormatEnum,
  ExportGlobalWorkflowsV2FilterCardEnum,
  ExportGlobalWorkflowsV2FilterStatusEnum,
  ExportGlobalWorkflowsV2WorkflowTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { IExportGlobalWorkflowsV2Params } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.d';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { message } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { ExportGlobalWorkflowButtonProps } from './index.type';

const ExportGlobalWorkflowButton: React.FC<ExportGlobalWorkflowButtonProps> = ({
  filterCard,
  workflowType,
  projectId,
  instanceId,
  tableFilterInfo,
  searchKeyword,
  onExportFinished
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    const exportWorkflows = (
      selectedExportFormat: GetAuditPlanSQLExportReqV1ExportFormatEnum
    ) => {
      const hideLoading = messageApi.loading(
        t('globalDashboard.workflow.export.exporting')
      );

      const params: IExportGlobalWorkflowsV2Params = {
        filter_card:
          filterCard as unknown as ExportGlobalWorkflowsV2FilterCardEnum,
        filter_project_uid: projectId,
        filter_instance_id: instanceId,
        workflow_type: workflowType
          ? (workflowType as unknown as ExportGlobalWorkflowsV2WorkflowTypeEnum)
          : undefined,
        filter_status: tableFilterInfo.filter_status
          ? (tableFilterInfo.filter_status as unknown as ExportGlobalWorkflowsV2FilterStatusEnum)
          : undefined,
        filter_update_time_from: tableFilterInfo.filter_update_time_from,
        filter_update_time_to: tableFilterInfo.filter_update_time_to,
        filter_create_user_id: tableFilterInfo.filter_create_user_id,
        filter_create_time_from: tableFilterInfo.filter_create_time_from,
        filter_create_time_to: tableFilterInfo.filter_create_time_to,
        keyword: searchKeyword?.trim() || undefined,
        export_format:
          selectedExportFormat as unknown as ExportGlobalWorkflowsV2ExportFormatEnum
      };

      GlobalDashboardService.ExportGlobalWorkflowsV2(params, {
        responseType: 'blob'
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('globalDashboard.workflow.export.successTips')
            );
          }
        })
        .finally(() => {
          hideLoading();
          onExportFinished?.();
        });
    };

    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Export_Global_Dashboard_Workflow_List,
      exportWorkflows
    );
    return () => {
      unsubscribe();
    };
  }, [
    filterCard,
    workflowType,
    projectId,
    instanceId,
    tableFilterInfo,
    searchKeyword,
    messageApi,
    t,
    onExportFinished
  ]);

  return <>{messageContextHolder}</>;
};

export default ExportGlobalWorkflowButton;
