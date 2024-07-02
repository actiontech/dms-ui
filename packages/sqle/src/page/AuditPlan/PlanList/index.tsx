import { useBoolean, useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import {
  useTableRequestError,
  TableToolbar,
  ActiontechTable,
  ColumnsSettingProps,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import PlanListDrawer from './Drawer';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';

import { ResponseCode } from '../../../data/common';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { IGetAuditPlansV2Params } from '@actiontech/shared/lib/api/sqle/service/audit_plan/index.d';
import { IAuditPlanResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import PlanListColumn, {
  type PlanListTableFilterParamType,
  PlanListAction
} from './column';
import {
  useCurrentProject,
  useCurrentUser,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import TableTaskTypeFilter from './TableTaskTypeFilter';

import { ModalName } from '../../../data/ModalName';
import {
  initAuditPlanModalStatus,
  updateAuditPlanModalStatus,
  updateSelectAuditPlan
} from '../../../store/auditPlan';
import {
  PlusOutlined,
  DownOutlined,
  UpOutlined,
  BookMarkTagFilled
} from '@actiontech/icons';
import { PlanListTaskTypeButtonStyleWrapper } from './style';

const AuditPlanList = () => {
  const { t } = useTranslation();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const { username, isAdmin, isProjectManager, uid } = useCurrentUser();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    tableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<IAuditPlanResV2, PlanListTableFilterParamType>();
  const [filterCustomData, setFilterCustomData] = useState({
    filter_audit_plan_db_type: '',
    filter_audit_plan_type: ''
  });

  // task type
  const [
    taskTypeShowStatus,
    { setFalse: setTaskTypeHide, setTrue: setTaskTypeShow }
  ] = useBoolean(true);

  const onChangeTaskTypeShow = () => {
    taskTypeShowStatus ? setTaskTypeHide() : setTaskTypeShow();
  };

  const { getLogoUrlByDbType } = useDbServiceDriver();

  // about table
  const {
    data: planList,
    loading,
    refresh: refreshApi
  } = useRequest(
    () => {
      const params: IGetAuditPlansV2Params = {
        ...tableFilterInfo,
        ...pagination,
        ...filterCustomData,
        fuzzy_search_audit_plan_name: searchKeyword,
        project_name: projectName
      };
      return handleTableRequestError(audit_plan.getAuditPlansV2(params));
    },
    {
      refreshDeps: [tableFilterInfo, pagination, filterCustomData, projectName]
    }
  );

  const onRefresh = () => {
    refreshApi();
  };

  const columns = useMemo(
    () => PlanListColumn(projectID, getLogoUrlByDbType),
    [getLogoUrlByDbType, projectID]
  );
  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'audit_plan_list',
      username
    }),
    [username]
  );

  const navigate = useNavigate();

  const onEditPlan = useCallback(
    (record: IAuditPlanResV2) => {
      navigate(
        `/sqle/project/${projectID}/audit-plan/update/${record.audit_plan_name}`
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectID]
  );

  const [messageApi, contextMessageHolder] = message.useMessage();

  const [
    removePending,
    { setTrue: startRemoveAuditPlan, setFalse: removeAuditPlanFinish }
  ] = useBoolean();
  const onDeletePlan = useCallback(
    (auditPlanName: string) => {
      if (removePending) {
        return;
      }
      const hide = messageApi.loading(
        t('auditPlan.remove.loading', { name: auditPlanName }),
        0
      );
      startRemoveAuditPlan();
      audit_plan
        .deleteAuditPlanV1({
          audit_plan_name: auditPlanName,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('auditPlan.remove.successTips', { name: auditPlanName })
            );
            onRefresh();
          }
        })
        .finally(() => {
          hide();
          removeAuditPlanFinish();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectName, removePending]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initAuditPlanModalStatus({
        modalStatus: {
          [ModalName.Subscribe_Notice]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = useCallback(
    (name: ModalName, row?: IAuditPlanResV2) => {
      if (row) {
        dispatch(updateSelectAuditPlan(row));
      }

      dispatch(
        updateAuditPlanModalStatus({
          modalName: name,
          status: true
        })
      );
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return PlanListAction({
      onDeletePlan,
      onEditPlan,
      openModal,
      projectArchive,
      isAdmin,
      isProjectManager: isProjectManager(projectName),
      userID: uid
    });
  }, [
    onDeletePlan,
    onEditPlan,
    openModal,
    projectArchive,
    isAdmin,
    isProjectManager,
    projectName,
    uid
  ]);

  const onCreate = () => {
    navigate(`/sqle/project/${projectID}/audit-plan/create`);
  };

  return (
    <>
      <PageHeader
        title={t('auditPlan.pageTitle')}
        extra={
          <EmptyBox if={!projectArchive}>
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
              onClick={onCreate}
            >
              {t('auditPlan.action.create')}
            </BasicButton>
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
              <PlanListTaskTypeButtonStyleWrapper size={5} align="center">
                <BookMarkTagFilled color="currentColor" fill="none" />
                {t('auditPlan.list.table.audit_plan_type')}
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
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      />
      {taskTypeShowStatus && (
        <TableTaskTypeFilter
          updateParams={(data) =>
            setFilterCustomData({
              filter_audit_plan_db_type: data.dataSourceType,
              filter_audit_plan_type: data.taskType
            })
          }
        />
      )}
      {contextMessageHolder}
      <ActiontechTable
        setting={tableSetting}
        loading={loading}
        dataSource={planList?.list ?? []}
        rowKey={(record: IAuditPlanResV2) => {
          return `${record?.audit_plan_name}`;
        }}
        pagination={{
          total: planList?.total ?? 0
        }}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
      <PlanListDrawer />
    </>
  );
};

export default AuditPlanList;
