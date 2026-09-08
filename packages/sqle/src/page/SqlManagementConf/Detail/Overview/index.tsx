import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useEffect, useRef } from 'react';
import {
  ConfDetailOverviewColumnActions,
  ConfDetailOverviewColumns
} from './column';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ConfDetailOverviewProps } from './index.type';
import { useRequest } from 'ahooks';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from '../index.data';
import { useTableAction } from './useTableAction';
import { Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IInstanceAuditPlanInfo } from '@actiontech/shared/lib/api/sqle/service/common';

const ConfDetailOverview: React.FC<ConfDetailOverviewProps> = ({
  activeTabKey,
  handleChangeTab,
  instanceAuditPlanId,
  refreshAuditPlanDetail,
  hasOpPermission
}) => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const columns = ConfDetailOverviewColumns(projectID);

  const {
    disabledAction,
    disabledActionPending,
    enabledAction,
    enabledActionPending,
    deleteAction,
    deleteActionPending,
    triggerCollectAction,
    triggerCollectActionPending
  } = useTableAction();

  const latestRowsRef = useRef<IInstanceAuditPlanInfo[]>([]);
  const requestPromiseRef = useRef<Promise<IInstanceAuditPlanInfo[]> | null>(
    null
  );
  const queuedOverviewRefreshRef = useRef(false);
  const refreshOverviewRef = useRef<() => void>(() => undefined);
  const requestOverview = useCallback(() => {
    if (requestPromiseRef.current) {
      queuedOverviewRefreshRef.current = true;
      return requestPromiseRef.current;
    }
    const request = instance_audit_plan
      .getInstanceAuditPlanOverviewV1({
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId
      })
      .then((res) => {
        if (res.data.code !== ResponseCode.SUCCESS) {
          throw new Error(res.data.message);
        }
        const rows = res.data.data ?? [];
        latestRowsRef.current = rows;
        return rows;
      })
      .catch(() => latestRowsRef.current)
      .finally(() => {
        requestPromiseRef.current = null;
        if (queuedOverviewRefreshRef.current) {
          queuedOverviewRefreshRef.current = false;
          queueMicrotask(() => refreshOverviewRef.current());
        }
      });
    requestPromiseRef.current = request;
    return request;
  }, [instanceAuditPlanId, projectName]);

  const { data, loading, refresh } = useRequest(requestOverview, {
    ready: activeTabKey === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY,
    pollingInterval: 5000,
    pollingWhenHidden: false
  });
  refreshOverviewRef.current = refresh;

  useEffect(() => {
    latestRowsRef.current = [];
  }, [instanceAuditPlanId]);

  useEffect(
    () => () => {
      queuedOverviewRefreshRef.current = false;
      refreshOverviewRef.current = () => undefined;
    },
    []
  );

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Sql_Management_Conf_Overview_List,
      refresh
    );

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  return (
    <Spin spinning={loading && !data} delay={300}>
      {messageContextHolder}

      <ActiontechTable
        rowKey={(record) => record.audit_plan_type?.audit_plan_id!}
        className="table-row-cursor"
        dataSource={data}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              handleChangeTab(
                record.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }}
        actions={ConfDetailOverviewColumnActions({
          enabledAction: (auditPlanId) => {
            enabledAction(instanceAuditPlanId, auditPlanId).then((res) => {
              if (res.data.code === ResponseCode.SUCCESS) {
                messageApi.success(
                  t('managementConf.detail.overview.actions.enabledSuccessTips')
                );
                refresh();
              }
            });
          },
          disabledAction: (auditPlanId) => {
            disabledAction(instanceAuditPlanId, auditPlanId).then((res) => {
              if (res.data.code === ResponseCode.SUCCESS) {
                messageApi.success(
                  t(
                    'managementConf.detail.overview.actions.disabledSuccessTips'
                  )
                );
                refresh();
              }
            });
          },
          deleteAction: (auditPlanId) => {
            deleteAction(instanceAuditPlanId, auditPlanId).then((res) => {
              if (res.data.code === ResponseCode.SUCCESS) {
                messageApi.success(
                  t('managementConf.detail.overview.actions.deleteSuccessTips')
                );
                refreshAuditPlanDetail();
                refresh();
              }
            });
          },
          triggerCollectAction: (auditPlanId) => {
            triggerCollectAction(instanceAuditPlanId, auditPlanId).then(
              (res) => {
                if (res.data.code === ResponseCode.SUCCESS) {
                  messageApi.success(
                    t(
                      'managementConf.detail.overview.actions.triggerCollectSuccessTips'
                    )
                  );
                  refresh();
                } else {
                  messageApi.error(res.data.message);
                }
              }
            );
          },
          disabledActionPending,
          enabledActionPending,
          deleteActionPending,
          triggerCollectActionPending,
          hasOpPermission
        })}
      />
    </Spin>
  );
};

export default ConfDetailOverview;
