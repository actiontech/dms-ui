import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DASHBOARD_COMMON_FILTER_TYPE,
  DASHBOARD_COMMON_GET_ORDER_NUMBER,
  generateSegmentedLabel
} from '../CommonTable';
import { DEVPanelFilterKey, IDEVPanelProps } from './index.type';
import { commonColumn } from '../CommonTable/column';
import { useRequest } from 'ahooks';
import { BasicSegmented } from '@actiontech/shared';
import {
  DashboardCommonListStyleWrapper,
  NoBorderedPageHeaderStyleWrapper,
  TableTitleStyleWrapper
} from '../CommonTable/style';
import { CustomToolbar } from '../CommonTable/CustomToolbar';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { IGetWorkflowsV1Params } from '@actiontech/shared/lib/api/sqle/service/workflow/index.d';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IWorkflowDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { MenuSquareFilled } from '@actiontech/icons';

const DEVPanel: React.FC<IDEVPanelProps> = ({
  workflowStatistics,
  getWorkflowStatistics,
  projectName
}) => {
  const { uid } = useCurrentUser();
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const [filterStatus, setFilterStatus] = useState<DEVPanelFilterKey>(
    getWorkflowsV1FilterStatusEnum.wait_for_audit
  );

  const columns = useMemo(() => commonColumn(projectID), [projectID]);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: orderList,
    loading,
    refresh: refreshTable
  } = useRequest(
    () => {
      const params: IGetWorkflowsV1Params = {
        page_index: 1,
        page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
        filter_create_user_id: uid,
        filter_status: filterStatus,
        project_name: projectName
      };
      return handleTableRequestError(workflow.getWorkflowsV1(params));
    },
    {
      refreshDeps: [filterStatus]
    }
  );

  const refresh = useCallback(() => {
    refreshTable();
    getWorkflowStatistics();
  }, [getWorkflowStatistics, refreshTable]);

  const { tableChange } = useTableRequestParams<
    IWorkflowDetailResV1,
    DASHBOARD_COMMON_FILTER_TYPE
  >();

  return (
    <DashboardCommonListStyleWrapper>
      <NoBorderedPageHeaderStyleWrapper>
        <TableTitleStyleWrapper>
          <MenuSquareFilled width={20} height={20} className="custom-icon" />
          {t('dashboard.title.myOrderSituation')}
        </TableTitleStyleWrapper>
      </NoBorderedPageHeaderStyleWrapper>

      <CustomToolbar refreshButton={{ refresh, disabled: loading }}>
        <BasicSegmented
          options={[
            {
              label: generateSegmentedLabel(
                t('dashboard.myOrderSituation.pendingReviewByMe'),
                workflowStatistics?.my_need_review_workflow_number
              ),
              value: getWorkflowsV1FilterStatusEnum['wait_for_audit']
            },
            {
              label: generateSegmentedLabel(
                t('dashboard.myOrderSituation.pendingExecByMe'),
                workflowStatistics?.my_need_execute_workflow_number
              ),
              value: getWorkflowsV1FilterStatusEnum['wait_for_execution']
            },
            {
              label: generateSegmentedLabel(
                t('dashboard.myOrderSituation.rejectedOrderByMe'),
                workflowStatistics?.my_rejected_workflow_number
              ),
              value: getWorkflowsV1FilterStatusEnum['rejected']
            }
          ]}
          onChange={(v) => {
            const key = v as typeof filterStatus;
            setFilterStatus(key);
          }}
        />
      </CustomToolbar>
      <ActiontechTable
        dataSource={orderList?.list}
        rowKey={(record: IWorkflowDetailResV1) => {
          return `${record?.workflow_id}`;
        }}
        pagination={false}
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
    </DashboardCommonListStyleWrapper>
  );
};

export default DEVPanel;
