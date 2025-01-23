import { useTranslation } from 'react-i18next';
import React, { useMemo, useState } from 'react';
import { Spin } from 'antd';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  EmptyBox,
  BasicResult,
  BasicSegmented,
  PageHeader
} from '@actiontech/shared';

import { SqlAnalyzeContStyleWrapper, SqlContStyleWrapper } from './style';
import useTableSchema from './useTableSchema';
import useSQLExecPlan from './useSQLExecPlan';
import { SqlAnalyzeProps } from '.';

const SqlAnalyze: React.FC<SqlAnalyzeProps> = (props) => {
  const { t } = useTranslation();
  const {
    tableMetas,
    sqlExplain,
    errorMessage,
    loading = false,
    performanceStatistics,
    errorType = 'error',
    sqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceLoading,
    getSqlExecPlanCostDataSourceError,
    showExecPlanCostChart,
    initTime
  } = props;

  const { generateTableSchemaContent } = useTableSchema();
  const { generateSQLExecPlanContent } = useSQLExecPlan({
    sqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceLoading,
    getSqlExecPlanCostDataSourceError,
    showExecPlanCostChart,
    initTime
  });

  const [tabStatus, setTabStatus] = useState<string>('sql');

  const createError = () => {
    if (errorType === 'error') {
      return (
        <BasicResult
          status={errorType}
          title={t('common.request.noticeFailTitle')}
          subTitle={errorMessage}
        />
      );
    }
    return <BasicResult status={errorType} title={errorMessage} />;
  };

  const getSegmentedOption = useMemo(() => {
    if (
      !(
        Array.isArray(tableMetas?.table_meta_items) &&
        tableMetas?.table_meta_items.length
      )
    ) {
      return [{ label: t('sqlAnalyze.sqlExplain'), value: 'sql' }];
    }
    return [{ label: t('sqlAnalyze.sqlExplain'), value: 'sql' }].concat(
      (tableMetas?.table_meta_items ?? []).map((table) => {
        return {
          label: t('sqlAnalyze.tableTitle', {
            tableName: table.name ?? ''
          }),
          value: table.name ?? ''
        };
      })
    );
  }, [tableMetas?.table_meta_items, t]);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader fixed title={t('sqlAnalyze.pageTitle')} />
      <Spin spinning={loading}>
        <SqlAnalyzeContStyleWrapper>
          <EmptyBox if={!errorMessage} defaultNode={createError()}>
            <section className="tab-wrapper">
              <BasicSegmented
                value={tabStatus}
                onChange={(value) => {
                  setTabStatus(value as string);
                }}
                options={getSegmentedOption}
              />
            </section>
            <section className="tab-cont-wrapper">
              <SqlContStyleWrapper>
                {tabStatus === 'sql' &&
                  generateSQLExecPlanContent({
                    ...sqlExplain,
                    ...performanceStatistics
                  })}
                {tableMetas?.table_meta_items?.map((table) => {
                  return (
                    <React.Fragment key={table.name}>
                      {generateTableSchemaContent({
                        errorMessage: '',
                        tableMeta: table,
                        isShow: tabStatus === table.name
                      })}
                    </React.Fragment>
                  );
                })}
              </SqlContStyleWrapper>
            </section>
          </EmptyBox>
        </SqlAnalyzeContStyleWrapper>
      </Spin>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default SqlAnalyze;
