import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { t } from '../../../locale';
import { compressToEncodedURIComponent } from 'lz-string';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';

type CreateWorkflowActionParams = {
  sql: string;
  instanceName: string;
  instanceId: string;
  projectID: string;
};

export const CreateWorkflowForModifiedSqlAction = (
  params: CreateWorkflowActionParams
) => {
  const { sql, instanceId, instanceName, projectID } = params;

  const compressionData = compressToEncodedURIComponent(
    JSON.stringify({
      sql,
      instanceName
    })
  );

  return (
    <PermissionControl
      permission={
        PERMISSIONS.ACTIONS.SQLE.DATA_SOURCE_COMPARISON
          .CREATE_MODIFIED_SQL_WORKFLOW
      }
      authDataSourceId={instanceId}
    >
      <ActionButton
        actionType="navigate-link"
        type="primary"
        text={t(
          'dataSourceComparison.entry.comparisonDetail.actions.createChangeWorkflow'
        )}
        link={{
          to: `/sqle/project/${projectID}/exec-workflow/create?from=${TRANSIT_FROM_CONSTANT.data_source_comparison}&compression_data=${compressionData}`,
          target: '_blank'
        }}
      />
    </PermissionControl>
  );
};
