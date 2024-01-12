import { act, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';

import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreComponentAutoCreatedListNoKey } from '@actiontech/shared/lib/testUtil/common';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';

import task from '@actiontech/shared/lib/api/sqle/service/task';
import { OrderSqlAnalyzeData } from '../__testData__';

import OrderSqlAnalyze from '.';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

describe('SqlAnalyze/Order', () => {
  ignoreComponentAutoCreatedListNoKey();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({
      taskId: 'taskId1',
      sqlNum: '123'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(task, 'getTaskAnalysisDataV2');
    spy.mockImplementation(() => resolveThreeSecond(OrderSqlAnalyzeData));
    return spy;
  };

  it('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = renderWithReduxAndTheme(
      <OrderSqlAnalyze />
    );
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith({
      task_id: 'taskId1',
      number: 123
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
      resolveErrorThreeSecond(OrderSqlAnalyzeData, {
        otherData: {
          code: 8001
        }
      })
    );
    const { container } = renderWithReduxAndTheme(<OrderSqlAnalyze />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
