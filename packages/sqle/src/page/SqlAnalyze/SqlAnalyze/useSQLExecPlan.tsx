import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  EmptyBox,
  BasicTable,
  BasicResult,
  SQLRenderer
} from '@actiontech/shared';
import useBackendTable from '../../../hooks/useBackendTable/useBackendTable';
import { SQLExecPlanItem } from './index.type';
import {
  IPerformanceStatistics,
  IChartPoint
} from '@actiontech/shared/lib/api/sqle/service/common.d';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { HorizontalTripleLineOutlined } from '@actiontech/icons';
import ExecPlanCostChart from './ExecPlanCostChart';
import { ExecPlanParams } from './index';
import { useState, useRef, useEffect, useMemo } from 'react';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import classNames from 'classnames';

const useSQLExecPlan = (params: ExecPlanParams) => {
  const {
    sqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceLoading,
    showExecPlanCostChart,
    getSqlExecPlanCostDataSourceError
  } = params;
  const { t } = useTranslation();
  const { tableColumnFactory } = useBackendTable();

  const targetRef = useRef<HTMLDivElement>(null);

  const [historyExecPlan, setHistoryExecPlan] = useState<IChartPoint>();

  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [historyExecPlan]);

  const currentTime = useMemo(() => formatTime(new Date()), []);

  const generateSQLExecPlanContent = <
    T extends Pick<SQLExecPlanItem, 'sql' | 'classic_result' | 'err_message'> &
      IPerformanceStatistics
  >(
    item: T
  ) => {
    const { sql, classic_result: explain, err_message, affect_rows } = item;

    const renderSQL = () => {
      return (
        <>
          <h3 className="header-title">{t('sqlQuery.executePlan.sql')}</h3>
          <section className="basic-cont-wrapper sql-cont">
            <SQLRenderer.Snippet showCopyIcon sql={sql ?? ''} />
          </section>
        </>
      );
    };

    const renderSqlCostChart = () => {
      return (
        <ExecPlanCostChart
          sqlExecPlanCostDataSource={sqlExecPlanCostDataSource}
          getSqlExecPlanCostDataSource={getSqlExecPlanCostDataSource}
          getSqlExecPlanCostDataSourceLoading={
            getSqlExecPlanCostDataSourceLoading
          }
          setHistoryExecPlan={setHistoryExecPlan}
          getSqlExecPlanCostDataSourceError={getSqlExecPlanCostDataSourceError}
        />
      );
    };

    const renderHistoryExecPlan = () => {
      if (!historyExecPlan) {
        return;
      }
      return (
        <div ref={targetRef} className="history-exec-plan-wrapper">
          <Space className="header-title full-width-element">
            {t('sqlQuery.executePlan.historyExecPlan')}
            <Typography.Text type="secondary">
              {historyExecPlan?.x}
            </Typography.Text>
          </Space>
          <BasicTable
            columns={tableColumnFactory(explain?.head ?? [], {
              customRender: (v) => v || '-'
            })}
            dataSource={historyExecPlan.info}
            pagination={false}
          />
        </div>
      );
    };

    const renderSQLExecPlan = () => {
      return (
        <>
          <Space className="header-title full-width-element">
            {t('sqlQuery.executePlan.sqlExplain')}
            <Typography.Text type="secondary">{currentTime}</Typography.Text>
          </Space>
          <EmptyBox
            if={!err_message}
            defaultNode={<BasicResult status="error" title={err_message} />}
          >
            <BasicTable
              columns={tableColumnFactory(explain?.head ?? [], {
                customRender: (v, record, index, fieldName) => {
                  const historyRecord = historyExecPlan?.info?.[index];
                  return (
                    <span
                      className={classNames({
                        'diff-highlight':
                          historyRecord && historyRecord[fieldName] !== v
                      })}
                    >
                      {v || '-'}
                    </span>
                  );
                }
              })}
              dataSource={explain?.rows ?? []}
              pagination={false}
            />
          </EmptyBox>
        </>
      );
    };

    const renderPerformanceStatistics = () => {
      return (
        <>
          <h3 className="header-title">
            {t('sqlQuery.executePlan.performanceStatistics')}
          </h3>
          <section className="basic-cont-wrapper">
            <EmptyBox
              if={!affect_rows?.err_message}
              defaultNode={
                <BasicResult
                  status="error"
                  title={`Error: ${affect_rows?.err_message}`}
                />
              }
            >
              <div className="line-wrapper">
                <div className="line-left">
                  <span className="icon-line">
                    <HorizontalTripleLineOutlined width={14} height={12} />
                  </span>

                  <div className="line-desc">
                    <h3>{t('sqlQuery.executePlan.affectRows')}</h3>
                    <p className="line-text">
                      {t('sqlQuery.executePlan.affectRowTips')}
                    </p>
                  </div>
                </div>
                <div className="number-cont">
                  {affect_rows?.count
                    ? formatParamsBySeparator(affect_rows?.count)
                    : '--'}
                </div>
              </div>
            </EmptyBox>
          </section>
        </>
      );
    };

    return (
      <Space direction="vertical" className="full-width-element" size={0}>
        {renderSQL()}
        <EmptyBox if={showExecPlanCostChart}>
          {renderSqlCostChart()}
          {renderHistoryExecPlan()}
        </EmptyBox>
        {renderSQLExecPlan()}
        {!err_message && renderPerformanceStatistics()}
      </Space>
    );
  };

  return {
    generateSQLExecPlanContent,
    historyExecPlan,
    setHistoryExecPlan
  };
};

export default useSQLExecPlan;
