import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  EmptyBox,
  BasicTable,
  BasicResult,
  SQLRenderer
} from '@actiontech/shared';
import useBackendTable from '../../../hooks/useBackendTable/useBackendTable1';
import { SQLExecPlanItem } from './index.type';
import { IPerformanceStatistics } from '@actiontech/shared/lib/api/sqle/service/common.d';
import { IconSqlLine } from '@actiontech/shared/lib/Icon/common';
import { formatParamsBySeparator } from '@actiontech/shared/lib/utils/Tool';

const useSQLExecPlan = () => {
  const { t } = useTranslation();
  const { tableColumnFactory } = useBackendTable();

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

    const renderSQLExplain = () => {
      return (
        <>
          <h3 className="header-title">
            {t('sqlQuery.executePlan.sqlExplain')}
          </h3>
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
                  <IconSqlLine className="icon-line" />
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
        {renderSQLExplain()}
        {!err_message && renderPerformanceStatistics()}
      </Space>
    );
  };

  return {
    generateSQLExecPlanContent
  };
};

export default useSQLExecPlan;
