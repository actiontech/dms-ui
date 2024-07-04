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
    navigate(`/sqle/project/${projectID}/sql-management-conf/${id}}`);
  };

  const stopAction = (id: string) => {
    instance_audit_plan
      .stopInstanceAuditPlanV1({
        project_name: projectName,
        instance_audit_plan_id: id
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          refresh();
          messageApi.success(
            t('managementConf.list.table.action.inactive.successTips')
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
    stopAction,
    deleteAction
  };
};

export default useTableAction;
