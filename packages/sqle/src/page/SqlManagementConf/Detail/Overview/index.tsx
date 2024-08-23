import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect } from 'react';
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

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    disabledAction,
    disabledActionPending,
    enabledAction,
    enabledActionPending,
    deleteAction,
    deleteActionPending
  } = useTableAction();

  const { data, loading, refresh } = useRequest(
    () =>
      handleTableRequestError(
        instance_audit_plan.getInstanceAuditPlanOverviewV1({
          project_name: projectName,
          instance_audit_plan_id: instanceAuditPlanId
        })
      ),
    {
      ready: activeTabKey === SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY
    }
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
    <Spin spinning={loading} delay={300}>
      {messageContextHolder}

      <ActiontechTable
        rowKey={(record) => record.audit_plan_type?.audit_plan_id!}
        className="table-row-cursor"
        dataSource={data?.list}
        errorMessage={requestErrorMessage}
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
          disabledActionPending,
          enabledActionPending,
          deleteActionPending,
          hasOpPermission
        })}
      />
    </Spin>
  );
};

export default ConfDetailOverview;
