import { BasicDrawer, SQLRenderer } from '@actiontech/shared';
import {
  IAuditResult,
  IDatabaseDiffModifySQL
} from '@actiontech/shared/lib/api/sqle/service/common';
import { Space, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ModifiedSqlStyleWrapper,
  SqlAuditResultCollapseStyleWrapper
} from '../ComparisonTreeNode/ComparisonDetailDrawer/style';
import {
  AuditResultMap,
  useAuditResultMapRuleInfo
} from '../../hooks/useAuditResultMapRuleInfo';
import { useMemo } from 'react';
import { SelectedInstanceInfo } from '../../index.type';
import AuditResult from '../ComparisonTreeNode/ComparisonDetailDrawer/AuditResult';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { CreateWorkflowForModifiedSqlAction } from '../../actions';

type Props = {
  open: boolean;
  onClose: () => void;
  instanceType: string;
  databaseDiffModifiedSqlInfos?: IDatabaseDiffModifySQL[];
  generateModifySqlPending: boolean;
  comparisonInstanceInfo?: SelectedInstanceInfo;
};

const ModifiedSqlDrawer: React.FC<Props> = ({
  open,
  databaseDiffModifiedSqlInfos,
  generateModifySqlPending,
  instanceType,
  onClose,
  comparisonInstanceInfo
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const auditResultMap = useMemo(() => {
    return databaseDiffModifiedSqlInfos?.reduce<AuditResultMap>((acc, cur) => {
      return {
        ...acc,
        [cur.schema_name!]: cur.modify_sqls?.flatMap(
          (v) => v.audit_results ?? []
        ) as IAuditResult[]
      };
    }, {});
  }, [databaseDiffModifiedSqlInfos]);

  const { auditResultRuleInfoMap, loading: getAuditResultsRuleInfoPending } =
    useAuditResultMapRuleInfo(auditResultMap, instanceType);

  const renderModifiedSqlInfo = (
    databaseDiffModifiedSqlInfo: IDatabaseDiffModifySQL
  ) => {
    return (
      <ModifiedSqlStyleWrapper key={databaseDiffModifiedSqlInfo.schema_name}>
        <Typography.Title level={4}>
          {t('dataSourceComparison.entry.comparisonDetail.modifySqlInfo', {
            schema: `SCHEMA-${databaseDiffModifiedSqlInfo.schema_name}-`
          })}
        </Typography.Title>
        <SQLRenderer.ViewOnlyEditor
          className="sql-audit-report-content"
          value={
            databaseDiffModifiedSqlInfo?.modify_sqls
              ?.map((v) => v.sql_statement)
              ?.join('\n') ?? ''
          }
          height={300}
        />

        <SqlAuditResultCollapseStyleWrapper
          items={[
            {
              key: databaseDiffModifiedSqlInfo.schema_name,
              label: t(
                'dataSourceComparison.entry.comparisonDetail.modifiedSqlAuditResultTitle'
              ),
              children: (
                <AuditResult
                  results={
                    auditResultRuleInfoMap[
                      databaseDiffModifiedSqlInfo.schema_name!
                    ] ?? []
                  }
                />
              )
            }
          ]}
        />
      </ModifiedSqlStyleWrapper>
    );
  };

  return (
    <BasicDrawer
      open={open}
      onClose={onClose}
      size="large"
      title={t('dataSourceComparison.entry.modifiedSqlDrawer.title')}
      extra={CreateWorkflowForModifiedSqlAction({
        projectID,
        sql:
          databaseDiffModifiedSqlInfos
            ?.map((info) =>
              info.modify_sqls?.map((v) => v.sql_statement).join('\n')
            )
            .join('\n') ?? '',
        instanceId: comparisonInstanceInfo?.instanceId ?? '',
        instanceName: comparisonInstanceInfo?.instanceName ?? ''
      })}
    >
      <Spin
        spinning={generateModifySqlPending || getAuditResultsRuleInfoPending}
      >
        <Space direction="vertical" className="full-width-element">
          {databaseDiffModifiedSqlInfos?.map(renderModifiedSqlInfo)}
        </Space>
      </Spin>
    </BasicDrawer>
  );
};

export default ModifiedSqlDrawer;
