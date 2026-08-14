import { useCallback, useEffect, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ActiontechTable,
  useTableRequestError
} from '@actiontech/dms-kit/es/components/ActiontechTable';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import { IWorkflowTemplateDetailResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { useTypedNavigate } from '@actiontech/shared';
import { ResponseCode, ROUTE_PATHS } from '@actiontech/dms-kit';
import { getWorkflowTemplateListV1WorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { WorkflowTemplateListColumn } from '../../columns';
import { WorkflowTemplateTableActions } from '../../actions';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';

export type WorkflowTemplateListTableProps = {
  workflowType: getWorkflowTemplateListV1WorkflowTypeEnum;
};

const WorkflowTemplateListTable: React.FC<WorkflowTemplateListTableProps> = ({
  workflowType
}) => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const { projectName, projectID } = useCurrentProject();
  const { parse2TableActionPermissions } = usePermission();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: templateList,
    loading,
    refresh
  } = useRequest(
    () =>
      handleTableRequestError(
        workflow.getWorkflowTemplateListV1({
          project_name: projectName,
          workflow_type: workflowType
        })
      ),
    {
      ready: !!projectName,
      refreshDeps: [projectName, workflowType]
    }
  );

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Workflow_Template_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  const onEdit = useCallback(
    (record?: IWorkflowTemplateDetailResV1) => {
      if (!record?.workflow_template_id) {
        return;
      }
      navigate(ROUTE_PATHS.SQLE.PROGRESS.update, {
        params: {
          projectID,
          workflowTemplateId: String(record.workflow_template_id)
        }
      });
    },
    [navigate, projectID]
  );

  const onDelete = useCallback(
    (record?: IWorkflowTemplateDetailResV1) => {
      if (!record?.workflow_template_id) {
        return;
      }
      const name = record.workflow_template_name ?? '';
      const hide = messageApi.loading(
        t('workflowTemplate.delete.deleting', { name }),
        0
      );
      workflow
        .deleteWorkflowTemplateV1({
          project_name: projectName,
          workflow_template_id: record.workflow_template_id
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('workflowTemplate.delete.successTips', { name })
            );
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, projectName, refresh, t]
  );

  const onSetDefault = useCallback(
    (record?: IWorkflowTemplateDetailResV1) => {
      if (!record?.workflow_template_id || record.is_default) {
        return;
      }
      workflow
        .updateWorkflowTemplateByIdV1({
          project_name: projectName,
          workflow_template_id: record.workflow_template_id,
          is_default: true
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('workflowTemplate.list.operator.setDefaultSuccess')
            );
            refresh();
          }
        });
    },
    [messageApi, projectName, refresh, t]
  );

  const columns = useMemo(() => WorkflowTemplateListColumn(), []);
  const actions = useMemo(
    () =>
      parse2TableActionPermissions(
        WorkflowTemplateTableActions(onEdit, onDelete, onSetDefault)
      ),
    [onDelete, onEdit, onSetDefault, parse2TableActionPermissions]
  );

  return (
    <>
      {messageContextHolder}
      <ActiontechTable
        rowKey="workflow_template_id"
        loading={loading}
        dataSource={templateList?.list ?? []}
        columns={columns}
        errorMessage={requestErrorMessage}
        actions={actions}
      />
    </>
  );
};

export default WorkflowTemplateListTable;
