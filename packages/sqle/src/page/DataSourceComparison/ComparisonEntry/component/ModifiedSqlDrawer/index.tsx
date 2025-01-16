import { BasicDrawer } from '@actiontech/shared';
import { IDatabaseDiffModifySQL } from '@actiontech/shared/lib/api/sqle/service/common';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { SelectedInstanceInfo } from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { CreateWorkflowForModifiedSqlAction } from '../../actions';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import ModifiedSqlAuditResult from '../ModifiedSqlAuditResult';
import { useState } from 'react';

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
