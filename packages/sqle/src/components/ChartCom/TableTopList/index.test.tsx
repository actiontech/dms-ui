import TableTopList, { ITableTopList } from '.';

import { act, cleanup, fireEvent } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../testUtils/mockHooks/mockThemeStyleData';

type typeTableItem = {
  key: string;
  a: string;
};

describe('sqle/components/ChartCom/TableTopList', () => {
  const customRender = (params: ITableTopList<typeTableItem>) => {
    return sqleSuperRender(<TableTopList {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when loading is true', () => {
    const onRefreshFn = jest.fn();
    const { baseElement } = customRender({
      apiLoading: true,
      emptyCont: 'this is a empty',
      onRefresh: onRefreshFn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has error', () => {
    const onRefreshFn = jest.fn();
    const { baseElement } = customRender({
      apiLoading: false,
      errorCont: 'this is a error',
      onRefresh: onRefreshFn
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has hideTop3Style', () => {
    const { baseElement } = customRender({
      apiLoading: false,
      rowKey: 'key',
      hideTop3Style: false,
      dataSource: [
        {
          key: '1',
          a: 'a1'
        },
        {
          key: '2',
          a: 'b1'
        },
        {
          key: '3',
          a: 'c1'
        },
        {
          key: '4',
          a: 'd1'
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });
});
