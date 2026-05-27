import { BasicDrawer } from '@actiontech/dms-kit';
import { IDatabaseDiffModifySQL } from '@actiontech/shared/lib/api/sqle/service/common';
import { Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { SelectedInstanceInfo } from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { CreateWorkflowForModifiedSqlAction } from '../../actions';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import ModifiedSqlAuditResult from '../ModifiedSqlAuditResult';
import { useMemo, useState } from 'react';
import { anySqlHasWarning } from './warningSql';
type Props = {
  open: boolean;
  onClose: () => void;
  instanceType: string;
  databaseDiffModifiedSqlInfos?: IDatabaseDiffModifySQL[];
  generateModifySqlPending: boolean;
  comparisonInstanceInfo?: SelectedInstanceInfo;
  genDatabaseDiffModifiedSQLsParams: IGenDatabaseDiffModifySQLsV1Params;
  dbExistingSchemas: string[];
};
const ModifiedSqlDrawer: React.FC<Props> = ({
  open,
  databaseDiffModifiedSqlInfos,
  generateModifySqlPending,
  instanceType,
  onClose,
  comparisonInstanceInfo,
  genDatabaseDiffModifiedSQLsParams,
  dbExistingSchemas
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const [auditResultCollapseActiveKeys, setAuditResultCollapseActiveKeys] =
    useState<string[]>([]);
  const resetDrawerAndClose = () => {
    onClose();
    setAuditResultCollapseActiveKeys([]);
  };
  // Surface the drawer-level warning banner exactly once when ANY modify SQL
  // across ANY schema contains a `-- WARNING:` line. The banner is independent
  // of dbType: drivers emit WARNING lines whenever a non-destructive ALTER is
  // not possible (e.g. Hive DROP+CREATE fallback, VIEW recreation).
  const hasAnyWarningSql = useMemo(() => {
    if (!databaseDiffModifiedSqlInfos) {
      return false;
    }
    return databaseDiffModifiedSqlInfos.some((schemaInfo) =>
      anySqlHasWarning(schemaInfo.modify_sqls)
    );
  }, [databaseDiffModifiedSqlInfos]);
  return (
    <BasicDrawer
      open={open}
      onClose={resetDrawerAndClose}
      size="large"
      title={t('dataSourceComparison.entry.modifiedSqlDrawer.title')}
      extra={CreateWorkflowForModifiedSqlAction({
        apiParams: genDatabaseDiffModifiedSQLsParams,
        comparisonInstanceID: comparisonInstanceInfo?.instanceId ?? '',
        comparisonInstanceName: comparisonInstanceInfo?.instanceName ?? '',
        projectID,
        dbExistingSchemas
      })}
    >
      <Spin spinning={generateModifySqlPending}>
        {hasAnyWarningSql && (
          <Alert
            data-testid="modified-sql-drop-create-warning-banner"
            type="warning"
            showIcon
            message={t(
              'dataSourceComparison.entry.modifiedSqlDrawer.dropCreateWarningBanner'
            )}
            style={{ marginBottom: 12 }}
          />
        )}
        <ModifiedSqlAuditResult
          auditResultCollapseActiveKeys={auditResultCollapseActiveKeys}
          auditResultCollapseActiveKeysOnChange={
            setAuditResultCollapseActiveKeys
          }
          instanceType={instanceType}
          dataSource={databaseDiffModifiedSqlInfos ?? []}
          instanceName={comparisonInstanceInfo?.instanceName ?? ''}
        />
      </Spin>
    </BasicDrawer>
  );
};
export default ModifiedSqlDrawer;
