import { ActionButton } from '@actiontech/shared';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { t } from '../../../locale';
import { compressToEncodedURIComponent } from 'lz-string';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';

type CreateWorkflowActionParams = {
  apiParams: IGenDatabaseDiffModifySQLsV1Params;
  comparisonInstanceID: string;
  comparisonInstanceName: string;
  projectID: string;
  dbExistingSchemas: string[];
};

export const CreateWorkflowForModifiedSqlAction = (
  params: CreateWorkflowActionParams
) => {
  const {
    apiParams,
    comparisonInstanceID,
    projectID,
    comparisonInstanceName,
    dbExistingSchemas
  } = params;

  const compressionData = compressToEncodedURIComponent(
    JSON.stringify({ ...apiParams, comparisonInstanceName, dbExistingSchemas })
  );

  return (
    <PermissionControl
      permission={
        PERMISSIONS.ACTIONS.SQLE.DATA_SOURCE_COMPARISON
          .CREATE_MODIFIED_SQL_WORKFLOW
      }
      authDataSourceId={comparisonInstanceID}
    >
      <ActionButton
        actionType="navigate-link"
        type="primary"
        text={t(
          'dataSourceComparison.entry.comparisonDetail.actions.createChangeWorkflow'
        )}
        link={{
          // todo TypedRouter 替换
          to: `/sqle/project/${projectID}/exec-workflow/create?gen_modified_sql_params=${compressionData}`,
          target: '_blank'
        }}
      />
    </PermissionControl>
  );
};
