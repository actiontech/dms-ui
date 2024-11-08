import { BasicDrawer, EmptyBox, SQLRenderer } from '@actiontech/shared';
import {
  IAuditResult,
  IDatabaseDiffModifySQL
} from '@actiontech/shared/lib/api/sqle/service/common';
import { Result, Space, Spin, Typography } from 'antd';
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
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import { DatabaseFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { uniqBy } from 'lodash';

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
  const { sharedTheme } = useThemeStyleData();

  const auditResultMap = useMemo(() => {
    return databaseDiffModifiedSqlInfos?.reduce<AuditResultMap>((acc, cur) => {
      return {
        ...acc,
        [cur.schema_name!]: uniqBy(
          cur.modify_sqls?.flatMap((v) => v.audit_results ?? []),
          'rule_name'
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
        <Space size={8} style={{ marginBottom: 8 }}>
          <DatabaseFilled
            width={18}
            height={18}
            color={sharedTheme.uiToken.colorPrimary}
          />
          <Typography.Title level={4} className="clear-margin-bottom">
            {t('dataSourceComparison.entry.comparisonDetail.modifySqlInfo', {
              schema: `${comparisonInstanceInfo?.instanceName}.${databaseDiffModifiedSqlInfo.schema_name}`
            })}
          </Typography.Title>
        </Space>
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
                <EmptyBox
                  if={!databaseDiffModifiedSqlInfo?.audit_error}
                  defaultNode={
                    <Result
                      status="error"
                      title={t(
                        'dataSourceComparison.entry.comparisonDetail.auditFailed'
                      )}
                      subTitle={databaseDiffModifiedSqlInfo?.audit_error}
                    />
                  }
                >
                  <AuditResult
                    results={
                      auditResultRuleInfoMap[
                        databaseDiffModifiedSqlInfo.schema_name!
                      ] ?? []
                    }
                  />
                </EmptyBox>
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
        apiParams: genDatabaseDiffModifiedSQLsParams,
        comparisonInstanceID: comparisonInstanceInfo?.instanceId ?? '',
        comparisonInstanceName: comparisonInstanceInfo?.instanceName ?? '',
        projectID,
        dbExistingSchemas
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
