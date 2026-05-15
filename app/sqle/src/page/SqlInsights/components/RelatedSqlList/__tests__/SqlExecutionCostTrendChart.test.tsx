import { cleanup, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlExecutionCostTrendChart from '../SqlExecutionCostTrendChart';
import { IRelatedSQLInfo } from '@actiontech/shared/lib/api/sqle/service/common';
import { RelatedSQLInfoSourceEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Scatter, ScatterConfig } from '@ant-design/plots';

const mockRecordWithData: IRelatedSQLInfo = {
  sql_fingerprint: 'SELECT * FROM users WHERE id = ?',
  source: RelatedSQLInfoSourceEnum.workflow,
  execute_time_avg: 1.5,
  execute_time_max: 3.0,
  execute_time_min: 0.5,
  execute_time_sum: 15.0,
  lock_wait_time: 0.1,
  execution_time_trend: {
    points: [
      {
        time: '2025-01-22 10:00:00',
        execute_time: 1.2,
        sql: 'SELECT * FROM users WHERE id = 1'
      },
      {
        time: '2025-01-22 11:00:00',
        execute_time: 1.8,
        sql: 'SELECT * FROM users WHERE id = 2'
      },
      {
        time: '2025-01-22 12:00:00',
        execute_time: 2.1,
        sql: 'SELECT * FROM users WHERE id = 3'
      }
    ],
    x_info: '时间',
    y_info: '执行成本'
  }
};

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Scatter: jest
      .requireActual('@ant-design/plots')
      .LineWithCustomRenderCalled({
        tooltip: {
          customContent: (props: ScatterConfig) => {
            return [
              '',
              [
                {
                  color: '#6094FC',
                  name: props.data[0]?.name,
                  value: props.data[0]?.value,
                  data: mockRecordWithData.execution_time_trend?.points?.[0]
                }
              ]
            ];
          }
        }
      })
  };
});

describe('SqlExecutionCostTrendChart', () => {
  const mockRecordWithoutData: IRelatedSQLInfo = {
    sql_fingerprint: 'SELECT * FROM users WHERE id = ?',
    source: RelatedSQLInfoSourceEnum.workflow,
    execute_time_avg: 1.5,
    execute_time_max: 3.0,
    execute_time_min: 0.5,
    execute_time_sum: 15.0,
    lock_wait_time: 0.1
  };

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should render chart with data correctly', () => {
    const { baseElement } = superRender(
      <SqlExecutionCostTrendChart record={mockRecordWithData} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should render empty state when no data', () => {
    superRender(<SqlExecutionCostTrendChart record={mockRecordWithoutData} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
