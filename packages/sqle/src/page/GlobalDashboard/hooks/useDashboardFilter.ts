import { useCurrentUser } from '@actiontech/shared/lib/features';
import { useMemo, useEffect, useCallback, useState } from 'react';
import useInstance from '../../../hooks/useInstance';
import { Form } from 'antd';
import { GlobalDashboardFilterType } from '../index.type';
import sqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { GetGlobalSqlManageStatisticsFilterProjectPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  GetGlobalWorkflowStatisticsFilterProjectPriorityEnum,
  GetGlobalWorkflowStatisticsFilterStatusListEnum
} from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { paramsSerializer } from '../utils';
import { useBoolean } from 'ahooks';

const useDashboardFilter = () => {
  const { bindProjects, userId } = useCurrentUser();

  const [form] = Form.useForm<GlobalDashboardFilterType>();

  const projectId = Form.useWatch('projectId', form);

  const instanceId = Form.useWatch('instanceId', form);

  const projectPriority = Form.useWatch('projectPriority', form);

  const [pendingSqlStatistics, setPendingSqlStatistics] = useState<number>();

  const [
    getPendingSqlStatisticsLoading,
    {
      setTrue: getPendingSqlStatisticsPending,
      setFalse: getPendingSqlStatisticsDone
    }
  ] = useBoolean();

  const {
    updateInstanceList,
    instanceIDOptions,
    loading: getInstanceListLoading
  } = useInstance();

  // #if [ee]
  const refreshPendingSqlStatistics = useCallback(() => {
    getPendingSqlStatisticsPending();
    sqlManage
      .GetGlobalSqlManageStatistics({
        filter_instance_id: instanceId,
        filter_project_priority:
          projectPriority as unknown as GetGlobalSqlManageStatisticsFilterProjectPriorityEnum,
        filter_project_uid: projectId
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setPendingSqlStatistics(res.data.total_nums);
        }
      })
      .finally(() => getPendingSqlStatisticsDone());
  }, [
    projectId,
    instanceId,
    projectPriority,
    getPendingSqlStatisticsPending,
    getPendingSqlStatisticsDone
  ]);
  // #endif

  const {
    data: pendingWorkflowOrderStatistics,
    loading: getPendingWorkflowOrderStatisticsLoading,
    refresh: refreshPendingWorkflowOrderStatistics
  } = useRequest(
    () =>
      workflow
        .GetGlobalWorkflowStatistics(
          {
            filter_instance_id: instanceId,
            filter_project_priority:
              projectPriority as unknown as GetGlobalWorkflowStatisticsFilterProjectPriorityEnum,
            filter_project_uid: projectId,
            filter_status_list: [
              GetGlobalWorkflowStatisticsFilterStatusListEnum.wait_for_audit,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.wait_for_execution,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.rejected,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.exec_failed
            ]
          },
          {
            paramsSerializer
          }
        )
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.total_nums;
          }
        }),
    {
      refreshDeps: [projectId, instanceId, projectPriority]
    }
  );

  const {
    data: initiatedWorkflowOrderStatistics,
    loading: getInitiatedWorkflowOrderStatisticsLoading,
    refresh: refreshInitiatedWorkflowOrderStatistics
  } = useRequest(
    () =>
      workflow
        .GetGlobalWorkflowStatistics(
          {
            filter_instance_id: instanceId,
            filter_project_priority:
              projectPriority as unknown as GetGlobalWorkflowStatisticsFilterProjectPriorityEnum,
            filter_project_uid: projectId,
            filter_status_list: [
              GetGlobalWorkflowStatisticsFilterStatusListEnum.wait_for_audit,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.wait_for_execution,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.rejected,
              GetGlobalWorkflowStatisticsFilterStatusListEnum.exec_failed
            ],
            filter_create_user_id: userId
          },
          {
            paramsSerializer
          }
        )
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.total_nums;
          }
        }),
    {
      refreshDeps: [projectId, instanceId, projectPriority]
    }
  );

  const projectOptions = useMemo(() => {
    return bindProjects.map((project) => {
      return {
        label: project.project_name,
        value: project.project_id
      };
    });
  }, [bindProjects]);

  useEffect(() => {
    if (projectId) {
      updateInstanceList({
        project_name:
          projectOptions.find((i) => i.value === projectId)?.label ?? ''
      });
    }
  }, [projectId, updateInstanceList, projectOptions]);

  const filterValues = useMemo(() => {
    return {
      projectId: projectId,
      instanceId: instanceId,
      projectPriority: projectPriority
    };
  }, [projectId, instanceId, projectPriority]);

  const updateFilterValue = useCallback(
    (key: keyof GlobalDashboardFilterType, value?: string) => {
      form.setFieldValue(key, value);
    },
    [form]
  );

  const getStatisticsLoading = useMemo(() => {
    return (
      getPendingWorkflowOrderStatisticsLoading ||
      getInitiatedWorkflowOrderStatisticsLoading ||
      getPendingSqlStatisticsLoading
    );
  }, [
    getInitiatedWorkflowOrderStatisticsLoading,
    getPendingSqlStatisticsLoading,
    getPendingWorkflowOrderStatisticsLoading
  ]);

  const refreshStatistics = useCallback(() => {
    // #if [ee]
    refreshPendingSqlStatistics();
    // #endif
    refreshPendingWorkflowOrderStatistics();
    refreshInitiatedWorkflowOrderStatistics();
  }, [
    // #if [ee]
    refreshPendingSqlStatistics,
    // #endif
    refreshPendingWorkflowOrderStatistics,
    refreshInitiatedWorkflowOrderStatistics
  ]);

  // #if [ee]
  useEffect(() => {
    refreshPendingSqlStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, instanceId, projectPriority]);
  // #endif

  return {
    projectOptions,
    updateInstanceList,
    instanceIDOptions,
    getInstanceListLoading,
    form,
    projectId,
    projectPriority,
    instanceId,
    updateFilterValue,
    filterValues,
    refreshStatistics,
    pendingSqlStatistics,
    pendingWorkflowOrderStatistics,
    initiatedWorkflowOrderStatistics,
    getStatisticsLoading
  };
};

export default useDashboardFilter;
