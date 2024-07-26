import { UpdateInstanceAuditPlanStatusReqV1ActiveEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import instance_audit_plan from '@actiontech/shared/lib/api/sqle/service/instance_audit_plan';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { MessageInstance } from 'antd/es/message/interface';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const editAction = (id: string) => {
    navigate(`/sqle/project/${projectID}/sql-management-conf/update/${id}`);
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
