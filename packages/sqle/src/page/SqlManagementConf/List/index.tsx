import {
  BasicButton,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import {
  IAuditPlanResV2,
  IInstanceAuditPlanResV1
} from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  ColumnsSettingProps,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  useCurrentProject,
  useCurrentUser,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ExtraFilterMeta,
  SqlManagementConfColumnAction,
  SqlManagementConfColumns
} from './column';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { Space, message } from 'antd';
import { IconArrowDown, IconArrowUp } from '@actiontech/shared/lib/Icon/common';
import { IconTaskType } from '../../../icon/AuditPlan';
import TableTaskTypeFilter from './TableTaskTypeFilter';
import { Link } from 'react-router-dom';
import { SqlManagementConfPageStyleWrapper } from './style';
import { IGetInstanceAuditPlansV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import useTableFilter from './hooks/useTableFilter';
import { InstanceAuditPlanTableFilterParamType } from './index.type';
import useTableAction from './hooks/useTableAction';

const ConfList: React.FC = () => {
  const { t } = useTranslation();
  const { projectArchive, projectName, projectID } = useCurrentProject();
  const { username, isAdmin, isProjectManager, uid } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const { getLogoUrlByDbType } = useDbServiceDriver();

  const columns = useMemo(
    () => SqlManagementConfColumns(projectID, getLogoUrlByDbType),
    [getLogoUrlByDbType, projectID]
  );

  const {
    tableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword,
    updateTableFilterInfo
  } = useTableRequestParams<
    IInstanceAuditPlanResV1,
    InstanceAuditPlanTableFilterParamType
  >();

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const {
    transformStatus,
    filterCustomData,
    filterCustomProps,
    setFilterCustomData
  } = useTableFilter();

  const [
    taskTypeShowStatus,
    { setFalse: setTaskTypeHide, setTrue: setTaskTypeShow }
  ] = useBoolean(true);

  const onChangeTaskTypeShow = () => {
    taskTypeShowStatus ? setTaskTypeHide() : setTaskTypeShow();
  };

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_management_conf',
      username
    }),
    [username]
  );

  const {
    data: planList,
    loading,
    refresh: onRefresh
  } = useRequest(
    () => {
      const params: IGetInstanceAuditPlansV1Params = {
        ...pagination,
        filter_by_db_type: filterCustomData.filter_by_db_type,
        filter_by_audit_plan_type: filterCustomData.filter_by_audit_plan_type,
        filter_by_active_status: transformStatus(
          tableFilterInfo.filter_by_active_status
        ),
        fuzzy_search: searchKeyword,
        project_name: projectName
      };
      return handleTableRequestError(
        instance_audit_plan.getInstanceAuditPlansV1(params)
      );
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterCustomData, projectName]
    }
  );

  const { editAction, stopAction, deleteAction } = useTableAction({
    refresh: onRefresh,
    projectID,
    projectName,
    messageApi
  });

  return (
    <SqlManagementConfPageStyleWrapper>
      <PageHeader
        title={t('managementConf.list.pageTitle')}
        extra={
          <EmptyBox if={!projectArchive}>
            <Link to={`/sqle/project/${projectID}/sql-management-conf/create`}>
              <BasicButton type="primary">
                {t('managementConf.list.pageAction.enableAuditPlan')}
              </BasicButton>
            </Link>
          </EmptyBox>
        }
      />
      <TableToolbar
        refreshButton={{ refresh: onRefresh, disabled: loading }}
        loading={loading}
        setting={tableSetting}
        actions={[
          {
            key: 'task-status-show-btn',
            text: (
              <Space size={5} align="center">
                <IconTaskType />
                {t('managementConf.list.pageAction.planType')}
                {taskTypeShowStatus ? <IconArrowUp /> : <IconArrowDown />}
              </Space>
            ),
            buttonProps: {
              onClick: onChangeTaskTypeShow,
              className: 'actiontech-table-setting-namespace'
            }
          }
        ]}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />

      <LazyLoadComponent open={taskTypeShowStatus} animation={false}>
        <TableTaskTypeFilter
          show={taskTypeShowStatus}
          updateParams={(data) =>
            setFilterCustomData({
              filter_by_db_type: data.dataSourceType,
              filter_by_audit_plan_type: data.taskType
            })
          }
        />
      </LazyLoadComponent>
      {contextMessageHolder}
      <ActiontechTable
        setting={tableSetting}
        loading={loading}
        dataSource={planList?.list ?? []}
        rowKey={(record) => {
          return `${record?.instance_audit_plan_id}`;
        }}
        pagination={{
          total: planList?.total ?? 0
        }}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={SqlManagementConfColumnAction({
          editAction,
          deleteAction,
          stopAction,
          userID: uid,
          isAdmin,
          isProjectManager: isProjectManager(projectName)
        })}
      />
    </SqlManagementConfPageStyleWrapper>
  );
};

export default ConfList;
