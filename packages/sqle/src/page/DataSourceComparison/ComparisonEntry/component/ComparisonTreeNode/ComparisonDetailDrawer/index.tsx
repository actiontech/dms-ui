import { CollapseProps, Space, Spin, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import databaseCompareService from '@actiontech/shared/lib/api/sqle/service/database_comparison';
import {
  IGenDatabaseDiffModifySQLsV1Params,
  IGetComparisonStatementV1Params
} from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
import {
  BasicButton,
  BasicDrawer,
  Copy,
  Download,
  BasicToolTip,
  EmptyBox
} from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import {
  ModifiedSqlStyleWrapper,
  DiffSQLEditorWrapperStyleWrapper,
  SqlAuditResultCollapseStyleWrapper,
  DiffSQLEditorSubTitleStyleWrapper
} from './style';
import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResult from '../../SqlAuditResult';
import { useMemo, useState } from 'react';
import { SelectedInstanceInfo } from '../../../index.type';
import dayjs from 'dayjs';
import { CreateWorkflowForModifiedSqlAction } from '../../../actions';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  filterSchemasInDatabase,
  getComparisonResultByNodeKey,
  parseTreeNodeKey
} from '../../../utils/TreeNode';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { DatabaseFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';
import ModifiedSqlAuditResultList from '../../ModifiedSqlAuditResult/List';
type Props = {
  open: boolean;
  onClose: () => void;
  getDetailParams: IGetComparisonStatementV1Params;
  genModifiedSqlParams: IGenDatabaseDiffModifySQLsV1Params;
  comparisonResults: ISchemaObject[];
  selectedBaselineInstanceInfo?: SelectedInstanceInfo;
  selectedComparisonInstanceInfo?: SelectedInstanceInfo;
  selectedObjectNodeKey: string;
};
enum CollapseItemKeyEnum {
  baseline = 'baseline',
  comparison = 'comparison',
  modified = 'modified'
}
const ComparisonDetailDrawer: React.FC<Props> = ({
  open,
  onClose,
  getDetailParams,
  genModifiedSqlParams,
  comparisonResults,
  selectedBaselineInstanceInfo,
  selectedComparisonInstanceInfo,
  selectedObjectNodeKey
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { sharedTheme } = useThemeStyleData();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { loading: getDetailPending, data: comparisonDetail } = useRequest(
    () =>
      databaseCompareService
        .getComparisonStatementV1(getDetailParams)
        .then((res) => res.data.data),
    {
      ready: open
    }
  );
  const [tableDDLAuditResultActiveKey, setTableDDLAuditResultActiveKey] =
    useState<CollapseItemKeyEnum[]>([]);
  const [
    modifiedSqlAuditResultCollapseActiveKeys,
    setModifiedSqlAuditResultCollapseActiveKeys
  ] = useState<string[]>([]);
  const {
    loading: generateModifiedSqlPending,
    data: modifiedSqlResult,
    runAsync: genModifiedSqlAsyncApi
  } = useRequest(
    () =>
      databaseCompareService
        .genDatabaseDiffModifySQLsV1(genModifiedSqlParams)
        .then((res) => res.data.data),
    {
      manual: true
    }
  );
  const modifiedSqls = useMemo(() => {
    return (
      modifiedSqlResult?.[0]?.modify_sqls
        ?.map((v) => v.sql_statement)
        ?.join('\n') ?? ''
    );
  }, [modifiedSqlResult]);
  const auditResultCollapseItems: CollapseProps['items'] = useMemo(() => {
    const items: CollapseProps['items'] = [];
    if (comparisonDetail?.base_sql) {
      items.push({
        key: CollapseItemKeyEnum.baseline,
        label: t(
          'dataSourceComparison.entry.comparisonDetail.baselineDDLAuditResultTitle'
        ),
        children: (
          <AuditResult
            shouldFetchRules={
              tableDDLAuditResultActiveKey.includes(
                CollapseItemKeyEnum.baseline
              ) && !comparisonDetail?.base_sql?.audit_error
            }
            instanceType={selectedBaselineInstanceInfo?.instanceType ?? ''}
            auditError={comparisonDetail.base_sql.audit_error}
            auditResults={
              comparisonDetail?.base_sql?.sql_statement_with_audit
                ?.audit_results ?? []
            }
          />
        )
      });
    }
    if (comparisonDetail?.comparison_sql) {
      items.push({
        key: CollapseItemKeyEnum.comparison,
        label: t(
          'dataSourceComparison.entry.comparisonDetail.comparisonDDLAuditResultTitle'
        ),
        children: (
          <AuditResult
            shouldFetchRules={
              tableDDLAuditResultActiveKey.includes(
                CollapseItemKeyEnum.comparison
              ) && !comparisonDetail?.comparison_sql?.audit_error
            }
            instanceType={selectedComparisonInstanceInfo?.instanceType ?? ''}
            auditError={comparisonDetail.comparison_sql.audit_error}
            auditResults={
              comparisonDetail?.comparison_sql?.sql_statement_with_audit
                ?.audit_results ?? []
            }
          />
        )
      });
    }
    return items;
  }, [
    comparisonDetail?.base_sql,
    comparisonDetail?.comparison_sql,
    selectedComparisonInstanceInfo?.instanceType,
    selectedBaselineInstanceInfo?.instanceType,
    t,
    tableDDLAuditResultActiveKey
  ]);
  const copyModifiedSql = () => {
    Copy.copyTextByTextarea(modifiedSqls);
    messageApi.success(t('common.copied'));
  };
  const downloadModifiedSql = () => {
    Download.downloadByCreateElementA(
      modifiedSqls,
      `${
        selectedComparisonInstanceInfo?.instanceName
      }-modified-sql-${dayjs().format('YYYYMMDDhhmmss')}.sql`
    );
  };
  const resetDrawerAndClose = () => {
    onClose();
    setTableDDLAuditResultActiveKey([]);
    setModifiedSqlAuditResultCollapseActiveKeys([]);
  };
  const { baselineSchemaName, comparisonSchemaName } = parseTreeNodeKey(
    selectedObjectNodeKey,
    comparisonResults
  );
  return (
    <BasicDrawer
      title={t('dataSourceComparison.entry.comparisonDetail.title')}
      open={open}
      onClose={resetDrawerAndClose}
      width={920}
      maskClosable
      footer={
        <EmptyBox if={!!modifiedSqlResult}>
          <Space size={12}>
            {CreateWorkflowForModifiedSqlAction({
              projectID,
              apiParams: genModifiedSqlParams,
              comparisonInstanceID:
                selectedComparisonInstanceInfo?.instanceId ?? '',
              comparisonInstanceName:
                selectedComparisonInstanceInfo?.instanceName ?? '',
              dbExistingSchemas: filterSchemasInDatabase(
                [selectedObjectNodeKey],
                comparisonResults
              )
            })}

            <BasicButton onClick={copyModifiedSql}>
              {t(
                'dataSourceComparison.entry.comparisonDetail.actions.copyChangeSQL'
              )}
            </BasicButton>
            <BasicButton onClick={downloadModifiedSql}>
              {t(
                'dataSourceComparison.entry.comparisonDetail.actions.downloadChangeSQL'
              )}
            </BasicButton>
          </Space>
        </EmptyBox>
      }
      extra={
        <EmptyBox if={!!comparisonDetail}>
          {getComparisonResultByNodeKey(
            comparisonResults,
            selectedObjectNodeKey
          ) === ObjectDiffResultComparisonResultEnum.same ? (
            <BasicToolTip
              title={t(
                'dataSourceComparison.entry.comparisonDetail.generateSQLDisabledTips'
              )}
            >
              <BasicButton type="primary" disabled>
                {t('dataSourceComparison.entry.comparisonDetail.generateSQL')}
              </BasicButton>
            </BasicToolTip>
          ) : (
            <BasicButton
              type="primary"
              onClick={() => {
                genModifiedSqlAsyncApi().then(() => {
                  setTimeout(() => {
                    const element = document.getElementById(
                      'modified-sql-wrapper'
                    );
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }, 0);
                });
              }}
            >
              {t('dataSourceComparison.entry.comparisonDetail.generateSQL')}
            </BasicButton>
          )}
        </EmptyBox>
      }
    >
      <Spin
        spinning={getDetailPending || generateModifiedSqlPending}
        delay={300}
      >
        {messageContextHolder}
        <DiffSQLEditorWrapperStyleWrapper>
          <Typography.Title level={4}>
            {t('dataSourceComparison.entry.comparisonDetail.ddlDiff')}
          </Typography.Title>

          <DiffSQLEditorSubTitleStyleWrapper>
            <div className="subtitle-item-wrapper">
              <DatabaseFilled color={sharedTheme.uiToken.colorPrimary} />
              <Typography.Text className="subtitle-item-text">
                {`${selectedBaselineInstanceInfo?.instanceName}.${baselineSchemaName}`}
              </Typography.Text>
            </div>

            <div className="subtitle-item-wrapper">
              <DatabaseFilled color={sharedTheme.uiToken.colorPrimary} />
              <Typography.Text className="subtitle-item-text">
                {`${selectedComparisonInstanceInfo?.instanceName}.${comparisonSchemaName}`}
              </Typography.Text>
            </div>
          </DiffSQLEditorSubTitleStyleWrapper>

          <SQLRenderer.DiffViewOnlyEditor
            originalSql={
              comparisonDetail?.base_sql?.sql_statement_with_audit
                ?.sql_statement
            }
            modifiedSql={
              comparisonDetail?.comparison_sql?.sql_statement_with_audit
                ?.sql_statement
            }
            height={400}
          />
        </DiffSQLEditorWrapperStyleWrapper>

        <EmptyBox if={!!auditResultCollapseItems.length}>
          <SqlAuditResultCollapseStyleWrapper
            activeKey={tableDDLAuditResultActiveKey}
            onChange={(key) => {
              setTableDDLAuditResultActiveKey(key as CollapseItemKeyEnum[]);
            }}
            items={auditResultCollapseItems}
          />
        </EmptyBox>

        <EmptyBox if={!!modifiedSqlResult}>
          <ModifiedSqlStyleWrapper id="modified-sql-wrapper">
            <Typography.Title level={4}>
              {t('dataSourceComparison.entry.comparisonDetail.modifySqlInfo')}
            </Typography.Title>

            <ModifiedSqlAuditResultList
              auditResultCollapseActiveKeys={
                modifiedSqlAuditResultCollapseActiveKeys
              }
              auditResultCollapseActiveKeysOnChange={
                setModifiedSqlAuditResultCollapseActiveKeys
              }
              instanceType={selectedComparisonInstanceInfo?.instanceType ?? ''}
              dataSource={modifiedSqlResult?.[0].modify_sqls ?? []}
              auditError={modifiedSqlResult?.[0].audit_error}
            />
          </ModifiedSqlStyleWrapper>
        </EmptyBox>
      </Spin>
    </BasicDrawer>
  );
};
export default ComparisonDetailDrawer;
