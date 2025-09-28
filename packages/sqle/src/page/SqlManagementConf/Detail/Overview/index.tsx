import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useEffect } from 'react';
import { confDetailOverviewColumns } from './column';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { ConfDetailOverviewProps } from './index.type';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { SQL_MANAGEMENT_CONF_OVERVIEW_TAB_KEY } from '../index.data';
import { useTableAction } from './useTableAction';
import { Spin, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/dms-kit';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { SqlManagementConfDetailOverviewTableActions } from './actions';
import useScanTypeVerify from '../../Common/ConfForm/useScanTypeVerify';

const ConfDetailOverview: React.FC<ConfDetailOverviewProps> = ({
  activeTabKey,
  handleChangeTab,
  instanceAuditPlanId,
  refreshAuditPlanDetail
}) => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { parse2TableActionPermissions } = usePermission();

  const { isPerformanceCollectScanType } = useScanTypeVerify();

  const columns = confDetailOverviewColumns(
    projectID,
    isPerformanceCollectScanType
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    disabledAction,
    disabledActionPending,
    enabledAction,
    enabledActionPending,
    deleteAction,
    deleteActionPending,
    resetTokenAction,
    resetTokenActionPending
  } = useTableAction();

  const { data, loading, refresh } = useRequest(
    () =>
      handleTableRequestError(
        SqleApi.InstanceAuditPlanService.getInstanceAuditPlanOverviewV1({
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
              if (isPerformanceCollectScanType(record.audit_plan_type?.type)) {
                return;
              }
              handleChangeTab(
                record.audit_plan_type?.audit_plan_id?.toString() ?? ''
              );
            }
          };
        }}
        actions={parse2TableActionPermissions(
          SqlManagementConfDetailOverviewTableActions({
            enabledAction: (auditPlanId) => {
              enabledAction(instanceAuditPlanId, auditPlanId).then((res) => {
                if (res.data.code === ResponseCode.SUCCESS) {
                  messageApi.success(
                    t(
                      'managementConf.detail.overview.actions.enabledSuccessTips'
                    )
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
                    t(
                      'managementConf.detail.overview.actions.deleteSuccessTips'
                    )
                  );
                  refreshAuditPlanDetail();
                  refresh();
                }
              });
            },
            resetTokenAction: () => {
              resetTokenAction(instanceAuditPlanId).then((res) => {
                if (res.data.code === ResponseCode.SUCCESS) {
                  messageApi.success(
                    t(
                      'managementConf.detail.overview.actions.resetTokenSuccessTips'
                    )
                  );
                  refresh();
                }
              });
            },
            disabledActionPending,
            enabledActionPending,
            deleteActionPending,
            resetTokenActionPending
          })
        )}
      />
    </Spin>
  );
};

export default ConfDetailOverview;
