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
  BasicToolTips,
  Copy,
  Download,
  EmptyBox,
  SQLRenderer
} from '@actiontech/shared';
import {
  ModifiedSqlStyleWrapper,
  DiffSQLEditorWrapperStyleWrapper,
  SqlAuditResultCollapseStyleWrapper
} from './style';
import { ObjectDiffResultComparisonResultEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResult from './AuditResult';
import { useMemo, useState } from 'react';
import { SelectedInstanceInfo } from '../../../index.type';
import dayjs from 'dayjs';
import useAuditResultRuleInfo from '../../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { CreateWorkflowForModifiedSqlAction } from '../../../actions';
import { useCurrentProject } from '@actiontech/shared/lib/global';

type Props = {
  open: boolean;
  onClose: () => void;
  getDetailParams: IGetComparisonStatementV1Params;
  genModifiedSqlParams: IGenDatabaseDiffModifySQLsV1Params;
  comparisonResult: ObjectDiffResultComparisonResultEnum;
  selectedBaselineInstanceInfo?: SelectedInstanceInfo;
  selectComparisonInstanceInfo?: SelectedInstanceInfo;
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
  comparisonResult,
  selectedBaselineInstanceInfo,
  selectComparisonInstanceInfo
}) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
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

  const [modifiedSqlAuditResultActiveKey, setModifiedSqlAuditResultActiveKey] =
    useState<CollapseItemKeyEnum[]>([]);

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

  const modifiedSqlAuditResults = useMemo(() => {
    return (
      modifiedSqlResult?.[0].modify_sqls?.flatMap(
        (v) => v.audit_results ?? []
      ) ?? []
    );
  }, [modifiedSqlResult]);

  const {
    auditResultRuleInfo: baselineSqlAuditResultRuleInfo,
    loading: getBaselineSqlAuditResultRuleInfoPending
  } = useAuditResultRuleInfo(
    comparisonDetail?.base_sql?.audit_results ?? [],
    selectedBaselineInstanceInfo?.instanceType,
    tableDDLAuditResultActiveKey.includes(CollapseItemKeyEnum.baseline)
  );

  const {
    auditResultRuleInfo: comparisonSqlAuditResultRuleInfo,
    loading: getComparisonSqlAuditResultRuleInfoPending
  } = useAuditResultRuleInfo(
    comparisonDetail?.comparison_sql?.audit_results ?? [],
    selectComparisonInstanceInfo?.instanceType,
    tableDDLAuditResultActiveKey.includes(CollapseItemKeyEnum.comparison)
  );

  const {
    auditResultRuleInfo: modifiedSqlAuditResultRuleInfo,
    loading: getModifiedSqlRulePending
  } = useAuditResultRuleInfo(
    modifiedSqlAuditResults,
    selectComparisonInstanceInfo?.instanceType,
    modifiedSqlAuditResultActiveKey.includes(CollapseItemKeyEnum.modified)
  );

  const auditResultCollapseItems: CollapseProps['items'] = useMemo(() => {
    const items: CollapseProps['items'] = [];
    if (comparisonDetail?.base_sql?.audit_results) {
      items.push({
        key: CollapseItemKeyEnum.baseline,
        label: t(
          'dataSourceComparison.entry.comparisonDetail.baselineDDLAuditResultTitle'
        ),
        children: (
          <Spin spinning={getBaselineSqlAuditResultRuleInfoPending}>
            <AuditResult results={baselineSqlAuditResultRuleInfo ?? []} />
          </Spin>
        )
      });
    }

    if (comparisonDetail?.comparison_sql?.audit_results) {
      items.push({
        key: CollapseItemKeyEnum.comparison,
        label: t(
          'dataSourceComparison.entry.comparisonDetail.comparisonDDLAuditResultTitle'
        ),
        children: (
          <Spin spinning={getComparisonSqlAuditResultRuleInfoPending}>
            <AuditResult results={comparisonSqlAuditResultRuleInfo ?? []} />
          </Spin>
        )
      });
    }

    return items;
  }, [
    baselineSqlAuditResultRuleInfo,
    comparisonDetail?.base_sql?.audit_results,
    comparisonDetail?.comparison_sql?.audit_results,
    comparisonSqlAuditResultRuleInfo,
    getBaselineSqlAuditResultRuleInfoPending,
    getComparisonSqlAuditResultRuleInfoPending,
    t
  ]);

  const modifiedSqlAuditResultCollapseItems: CollapseProps['items'] =
    useMemo(() => {
      const items: CollapseProps['items'] = [];
      if (modifiedSqlAuditResults.length) {
        items.push({
          key: CollapseItemKeyEnum.modified,
          label: t(
            'dataSourceComparison.entry.comparisonDetail.modifiedSqlAuditResultTitle'
          ),
          children: (
            <AuditResult results={modifiedSqlAuditResultRuleInfo ?? []} />
          )
        });
      }

      return items;
    }, [modifiedSqlAuditResultRuleInfo, modifiedSqlAuditResults.length, t]);

  const copyModifiedSql = () => {
    Copy.copyTextByTextarea(modifiedSqls);
    messageApi.success(t('common.copied'));
  };

  const downloadModifiedSql = () => {
    Download.downloadByCreateElementA(
      modifiedSqls,
      `${
        selectComparisonInstanceInfo?.instanceName
      }-modified-sql-${dayjs().format('YYYYMMDDhhmmss')}.sql`
    );
  };

  return (
    <BasicDrawer
      title={t('dataSourceComparison.entry.comparisonDetail.title')}
      open={open}
      onClose={onClose}
      width={920}
      maskClosable
      footer={
        <EmptyBox if={!!modifiedSqlResult}>
          <Space size={12}>
            {CreateWorkflowForModifiedSqlAction({
              projectID,
              sql: modifiedSqls,
              instanceId: selectComparisonInstanceInfo?.instanceId ?? '',
              instanceName: selectComparisonInstanceInfo?.instanceName ?? ''
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
          {comparisonResult === ObjectDiffResultComparisonResultEnum.same ? (
            <BasicToolTips
              title={t(
                'dataSourceComparison.entry.comparisonDetail.generateSQLDisabledTips'
              )}
            >
              <BasicButton type="primary" disabled>
                {t('dataSourceComparison.entry.comparisonDetail.generateSQL')}
              </BasicButton>
            </BasicToolTips>
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
                      element.scrollIntoView({ behavior: 'smooth' });
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
        spinning={
          getDetailPending ||
          generateModifiedSqlPending ||
          getModifiedSqlRulePending
        }
        delay={300}
      >
        {messageContextHolder}
        <DiffSQLEditorWrapperStyleWrapper>
          <Typography.Title level={4}>
            {t('dataSourceComparison.entry.comparisonDetail.ddlDiff')}
          </Typography.Title>

          <SQLRenderer.DiffViewOnlyEditor
            originalSql={comparisonDetail?.base_sql?.sql_statement}
            modifiedSql={comparisonDetail?.comparison_sql?.sql_statement}
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
            <SQLRenderer.ViewOnlyEditor
              className="sql-audit-report-content"
              value={modifiedSqls}
              height={400}
            />

            <EmptyBox if={!!modifiedSqlAuditResultCollapseItems.length}>
              <SqlAuditResultCollapseStyleWrapper
                activeKey={modifiedSqlAuditResultActiveKey}
                onChange={(key) => {
                  setModifiedSqlAuditResultActiveKey(
                    key as CollapseItemKeyEnum[]
                  );
                }}
                items={modifiedSqlAuditResultCollapseItems}
              />
            </EmptyBox>
          </ModifiedSqlStyleWrapper>
        </EmptyBox>
      </Spin>
    </BasicDrawer>
  );
};

export default ComparisonDetailDrawer;
