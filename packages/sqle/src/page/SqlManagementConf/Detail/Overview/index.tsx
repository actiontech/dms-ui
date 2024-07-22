import {
  ActiontechTable,
  ColumnsSettingProps,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useEffect, useMemo } from 'react';
import {
  ConfDetailOverviewColumnActions,
  ConfDetailOverviewColumns
} from './column';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
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
  instanceAuditPlanId
}) => {
  const { t } = useTranslation();
  const { username } = useCurrentUser();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const columns = ConfDetailOverviewColumns();

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_management_conf_detail_overview',
      username
    }),
    [username]
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { disabledAction, disabledActionPending } = useTableAction();

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
        className="table-row-cursor"
        dataSource={data?.list}
        errorMessage={requestErrorMessage}
        columns={columns}
        setting={tableSetting}
        onRow={(record) => {
          return {
            onClick: () => {
              handleChangeTab(record.audit_plan_type?.type ?? '');
            }
          };
        }}
        actions={ConfDetailOverviewColumnActions(
          () => {
            console.log('enabledAction');
          },
          (id, type) => {
            return disabledAction(id, type).then((res) => {
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
          disabledActionPending
        )}
      />
    </Spin>
  );
};

export default ConfDetailOverview;
