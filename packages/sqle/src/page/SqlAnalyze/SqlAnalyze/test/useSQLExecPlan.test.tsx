import { act } from '@testing-library/react';
import { renderHooksWithTheme } from '../../../../testUtils/customRender';

import useSQLExecPlan from '../useSQLExecPlan';
import { sqlExecPlans } from '../../__testData__';

describe('SqlAnalyze/useSQLExecPlan', () => {
  it('render generateSQLExecPlanContent when have err_message', async () => {
    const { result } = renderHooksWithTheme(() => useSQLExecPlan());

    await act(async () => {
      const elementEmpty = result.current.generateSQLExecPlanContent({});
      expect(elementEmpty).toMatchSnapshot();
    });

    await act(async () => {
      const elementError = result.current.generateSQLExecPlanContent({
        err_message: 'sql_explain err_message'
      });
      expect(elementError).toMatchSnapshot();
    });
  });

  it('render generateSQLExecPlanContent when have data', async () => {
    const { result } = renderHooksWithTheme(() => useSQLExecPlan());

    await act(async () => {
      const elementSQL = result.current.generateSQLExecPlanContent({
        sql: "CREATE TABLE IF NOT EXISTS task (  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,  title VARCHAR(255) NOT NULL DEFAULT '',  description TEXT,  status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);"
      });
      expect(elementSQL).toMatchSnapshot();
    });

    await act(async () => {
      const elementSQLExplain = result.current.generateSQLExecPlanContent({
        classic_result: sqlExecPlans[1].classic_result
      });
      expect(elementSQLExplain).toMatchSnapshot();
    });

    await act(async () => {
      const elementPerformanceStatisticsError =
        result.current.generateSQLExecPlanContent({
          affect_rows: {
            err_message: 'affect_rows error'
          }
        });
      expect(elementPerformanceStatisticsError).toMatchSnapshot();
    });

    await act(async () => {
      const elementPerformanceStatistics =
        result.current.generateSQLExecPlanContent({
          affect_rows: {
            count: 10,
            err_message: ''
          }
        });
      expect(elementPerformanceStatistics).toMatchSnapshot();
    });
  });
});
