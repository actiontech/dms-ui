import { useTypedNavigate } from '@actiontech/shared';
import { UpdateInstanceAuditPlanStatusReqV1ActiveEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { ResponseCode } from '@actiontech/dms-kit';
import { MessageInstance } from 'antd/es/message/interface';
import { useTranslation } from 'react-i18next';

type Params = {
  refresh: () => void;
  messageApi: MessageInstance;
  projectID: string;
  projectName: string;
};

const useTableAction = ({
  refresh,
  messageApi,
  projectID,
  projectName
}: Params) => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const editAction = (id: string) => {
    navigate(ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.update, {
      params: { projectID, id }
    });
  };

  const disabledAction = (id: string) => {
    instance_audit_plan
      .updateInstanceAuditPlanStatusV1({
        project_name: projectName,
        instance_audit_plan_id: id,
        active: UpdateInstanceAuditPlanStatusReqV1ActiveEnum.disabled
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          messageApi.success(
            t('managementConf.list.table.action.disabled.successTips')
          );
        }
      });
  };

  const enabledAction = (id: string) => {
    instance_audit_plan
      .updateInstanceAuditPlanStatusV1({
        project_name: projectName,
        instance_audit_plan_id: id,
        active: UpdateInstanceAuditPlanStatusReqV1ActiveEnum.normal
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          messageApi.success(
            t('managementConf.list.table.action.enabled.successTips')
          );
        }
      });
  };

  const deleteAction = (id: string) => {
    instance_audit_plan
      .deleteInstanceAuditPlanV1({
        project_name: projectName,
        instance_audit_plan_id: id
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          messageApi.success(
            t('managementConf.list.table.action.delete.successTips')
          );
        }
      });
  };

  return {
    editAction,
    disabledAction,
    enabledAction,
    deleteAction
  };
};

export default useTableAction;
