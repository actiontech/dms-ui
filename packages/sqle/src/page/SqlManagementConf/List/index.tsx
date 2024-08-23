import {
  BasicButton,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
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
  useDbServiceDriver,
  useUserOperationPermission
} from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ExtraFilterMeta,
  SqlManagementConfColumnAction,
  SqlManagementConfColumns
} from './column';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { Spin, message } from 'antd';
import TableTaskTypeFilter from './TableTaskTypeFilter';
import { Link } from 'react-router-dom';
import {
  PlanListTaskTypeButtonStyleWrapper,
  SqlManagementConfPageStyleWrapper
} from './style';
import { IGetInstanceAuditPlansV1Params } from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan/index.d';
import useTableFilter from './hooks/useTableFilter';
import { InstanceAuditPlanTableFilterParamType } from './index.type';
import useTableAction from './hooks/useTableAction';
import {
  DownOutlined,
  UpOutlined,
  BookMarkTagOutlined
} from '@actiontech/icons';
import useAuditPlanTypes from '../../../hooks/useAuditPlanTypes';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const List: React.FC = () => {
  const { t } = useTranslation();
  const { projectArchive, projectName, projectID } = useCurrentProject();
  const { username } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const { getLogoUrlByDbType } = useDbServiceDriver();

  const columns = useMemo(
    () => SqlManagementConfColumns(getLogoUrlByDbType),
    [getLogoUrlByDbType]
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

  const {
    updateUserOperationPermission,
    loading: getUserOperationPermissionLoading,
    isHaveServicePermission
  } = useUserOperationPermission();

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo, ExtraFilterMeta());

  const {
    filterCustomData,
    filterCustomProps,
    setFilterCustomData,
    updateInstanceList
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
    loading: getTaskTypesLoading,
    auditPlanTypes,
    updateAuditPlanTypes
  } = useAuditPlanTypes();

  const {
    data: planList,
    loading: getTableDataLoading,
    refresh: onRefresh
  } = useRequest(
    () => {
      const params: IGetInstanceAuditPlansV1Params = {
        ...pagination,
        filter_by_db_type: filterCustomData.filter_by_db_type,
        filter_by_audit_plan_type: filterCustomData.filter_by_audit_plan_type,
        filter_by_active_status: tableFilterInfo.filter_by_active_status,
        filter_by_instance_id: tableFilterInfo.filter_by_instance_id,
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

  const { editAction, disabledAction, enabledAction, deleteAction } =
    useTableAction({
      refresh: onRefresh,
      projectID,
      projectName,
      messageApi
    });

  useEffect(() => {
    if (taskTypeShowStatus) {
      updateAuditPlanTypes();
    }
  }, [taskTypeShowStatus, updateAuditPlanTypes]);

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
    updateUserOperationPermission();
  }, [updateInstanceList, projectName, updateUserOperationPermission]);

  return (
    <SqlManagementConfPageStyleWrapper>
      <PageHeader
        title={t('managementConf.list.pageTitle')}
        extra={
          <EmptyBox
            if={
              !projectArchive &&
              isHaveServicePermission(
                OpPermissionItemOpPermissionTypeEnum.save_audit_plan
              )
            }
          >
            <Link to={`/sqle/project/${projectID}/sql-management-conf/create`}>
              <BasicButton type="primary">
                {t('managementConf.list.pageAction.enableAuditPlan')}
              </BasicButton>
            </Link>
          </EmptyBox>
        }
      />
      <Spin
        spinning={
          getTaskTypesLoading ||
          getTableDataLoading ||
          getUserOperationPermissionLoading
        }
        delay={300}
      >
        <TableToolbar
          refreshButton={{ refresh: onRefresh, disabled: getTableDataLoading }}
          setting={tableSetting}
          actions={[
            {
              key: 'task-status-show-btn',
              text: (
                <PlanListTaskTypeButtonStyleWrapper size={5} align="center">
                  <BookMarkTagOutlined width={14} height={14} />
                  <span>{t('managementConf.list.pageAction.planType')}</span>
                  {taskTypeShowStatus ? (
                    <UpOutlined color="currentColor" />
                  ) : (
                    <DownOutlined color="currentColor" />
                  )}
                </PlanListTaskTypeButtonStyleWrapper>
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
          filterCustomProps={filterCustomProps}
        />

        <LazyLoadComponent open={taskTypeShowStatus} animation={false}>
          <TableTaskTypeFilter
            auditPlanTypes={auditPlanTypes}
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
            disabledAction,
            enabledAction,
            isHaveServicePermission
          })}
        />
      </Spin>
    </SqlManagementConfPageStyleWrapper>
  );
};

export default List;
