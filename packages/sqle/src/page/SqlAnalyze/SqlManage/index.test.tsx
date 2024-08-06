import { act, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';

import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { SQLManageSqlAnalyzeData } from '../__testData__';
import SQLManageAnalyze from '.';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

const projectName = 'default';

describe('SqlAnalyze/SQLManage', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({
      sqlManageId: 'sqlManageId1',
      sqlNum: '123',
      projectName
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(SqlManage, 'GetSqlManageSqlAnalysisV1');
    spy.mockImplementation(() => resolveThreeSecond(SQLManageSqlAnalyzeData));
    return spy;
  };

  it('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = renderWithReduxAndTheme(
      <SQLManageAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      project_name: projectName,
      sql_manage_id: 'sqlManageId1'
    });

    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();

    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[1]);
    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[2]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  it('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(
        {
          sql_explain: {
            err_message: 'error: sql_explain'
          },
          table_metas: {
            err_message: 'error: table_metas'
          },
          performance_statistics: {
            affect_rows: {
              err_message: 'error: affect_rows'
            }
          }
        },
        {
          otherData: {
            code: 8001
          }
        }
      )
    );
    const { container } = renderWithReduxAndTheme(
      <SQLManageAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('should render error result of type "error" when response code is not 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(
        {
          sql_explain: {
            err_message: 'error: sql_explain'
          },
          table_metas: {
            err_message: 'error: table_metas'
          },
          performance_statistics: {
            affect_rows: {
              err_message: 'error: affect_rows'
            }
          }
        },
        {
          otherData: {
            code: 8000
          }
        }
      )
    );
    const { container } = renderWithReduxAndTheme(
      <SQLManageAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
