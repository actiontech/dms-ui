import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  EmptyBox,
  BasicTable,
  BasicResult,
  SQLRenderer,
  BasicButton,
  ActionButton
} from '@actiontech/shared';
import useBackendTable from '../../../hooks/useBackendTable/useBackendTable';
import { SQLExecPlanItem } from './index.type';
import { IPerformanceStatistics } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';
import { HorizontalTripleLineOutlined } from '@actiontech/icons';
import ExecPlanCostChart from './ExecPlanCostChart';
import { ExecPlanParams } from './index';
import { useRef, useMemo } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

const useSQLExecPlan = (params: ExecPlanParams) => {
  const {
    sqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSource,
    getSqlExecPlanCostDataSourceLoading,
    showExecPlanCostChart,
    getSqlExecPlanCostDataSourceError,
    initTime,
    selectedPoint,
    setSelectedPoint,
    onCreateSqlOptimizationOrview,
    createSqlOptimizationLoading,
    allowSqlOptimization,
    getPerformanceStatistics,
    isPerformanceInfoLoaded
  } = params;
  const { t } = useTranslation();
  const { tableColumnFactory } = useBackendTable();

  const targetRef = useRef<HTMLDivElement>(null);

  const onScrollIntoView = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sortedSelectedPoint = useMemo(() => {
    if (!selectedPoint) {
      return;
    }
    return selectedPoint.sort((a, b) =>
      dayjs(a?.x).isBefore(dayjs(b?.x)) ? -1 : 1
    );
  }, [selectedPoint]);

  const generateSQLExecPlanContent = <
    T extends Pick<
      SQLExecPlanItem,
      'sql' | 'classic_result' | 'err_message' | 'cost'
    > &
      IPerformanceStatistics
  >(
    item: T
  ) => {
    const { sql, classic_result: explain, err_message, affect_rows } = item;

    const renderSQL = () => {
      return (
        <>
          <div className="sql-title-wrapper">
            <h3>{t('sqlQuery.executePlan.sql')}</h3>
            <EmptyBox
              if={
                !!explain &&
                !!explain.head &&
                !!explain.rows &&
                allowSqlOptimization
              }
            >
              <BasicButton
                type="primary"
                onClick={onCreateSqlOptimizationOrview}
                loading={createSqlOptimizationLoading}
              >
                {t('sqlQuery.executePlan.optimize')}
              </BasicButton>
            </EmptyBox>
          </div>
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
          onScrollIntoView={onScrollIntoView}
          getSqlExecPlanCostDataSourceError={getSqlExecPlanCostDataSourceError}
          initTime={initTime}
          selectedPoint={selectedPoint}
          setSelectedPoint={setSelectedPoint}
        />
      );
    };

    const renderExecPlanComparison = () => {
      if (!sortedSelectedPoint) {
        return;
      }
      return sortedSelectedPoint.map((point, pointIndex) => {
        return (
          <div className="history-exec-plan-wrapper" key={point?.x}>
            <Space className="header-title full-width-element">
              {t('sqlQuery.executePlan.sqlExplain')}
              <Typography.Text type="secondary">{point?.x}</Typography.Text>
              <Typography.Text type="secondary">
                {t('sqlQuery.executePlan.cost')}：{point?.y}
              </Typography.Text>
            </Space>
            <BasicTable
              columns={tableColumnFactory(explain?.head ?? [], {
                customRender: (v, record, index, fieldName) => {
                  if (pointIndex === 1) {
                    const historyRecord = sortedSelectedPoint[0]?.info?.[index];
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
                  return v || '-';
                }
              })}
              dataSource={point?.info}
              pagination={false}
            />
          </div>
        );
      });
    };

    const renderSQLExecPlan = () => {
      return (
        <>
          <Space className="header-title full-width-element">
            {t('sqlQuery.executePlan.sqlExplain')}
          </Space>
          <EmptyBox
            if={!err_message}
            defaultNode={<BasicResult status="error" title={err_message} />}
          >
            <BasicTable
              columns={tableColumnFactory(explain?.head ?? [], {
                customRender: (v) => v || '-'
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
                  <EmptyBox
                    if={isPerformanceInfoLoaded}
                    defaultNode={
                      <ActionButton
                        type="primary"
                        text={t(
                          'sqlQuery.executePlan.getPerformanceStatistics'
                        )}
                        actionType="confirm"
                        confirm={{
                          title: t(
                            'sqlQuery.executePlan.getPerformanceStatisticsTips'
                          ),
                          onConfirm: getPerformanceStatistics
                        }}
                      />
                    }
                  >
                    {affect_rows?.count
                      ? formatParamsBySeparator(affect_rows?.count)
                      : '--'}
                  </EmptyBox>
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
        <EmptyBox if={showExecPlanCostChart} defaultNode={renderSQLExecPlan()}>
          {renderSqlCostChart()}
          <div ref={targetRef}>{renderExecPlanComparison()}</div>
        </EmptyBox>
        {!err_message && renderPerformanceStatistics()}
      </Space>
    );
  };

  return {
    generateSQLExecPlanContent
  };
};

export default useSQLExecPlan;
