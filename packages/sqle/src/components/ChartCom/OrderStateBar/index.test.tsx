import OrderStateBar, { IOrderStateBar } from '.';

import { sqleSuperRender } from '../../../testUtils/superRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { act, cleanup, fireEvent } from '@testing-library/react';

const typeItemData = [
  {
    key: 'a1',
    value: 10,
    rate: 20,
    color: 'red',
    text: '第一部分'
  },
  {
    key: 'b1',
    value: 20,
    rate: 30,
    color: 'green',
    text: '第二部分'
  },
  {
    key: 'c1',
    value: 40,
    rate: 50,
    color: 'blue',
    text: '第三部分'
  },
  {
    key: 'd1',
    value: 50,
    rate: 60,
    color: 'black',
    text: '第四部分'
  }
];

describe('sqle/components/ChartCom/OrderStateBar', () => {
  const customRender = (params: IOrderStateBar) => {
    return sqleSuperRender(<OrderStateBar {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when is empty true', () => {
    const { baseElement } = customRender({
      isEmpty: true,
      barData: [],
      legendData: [],
      localData: {
        tooltip: {
          numTitle: 'number title',
          rateTitle: 'rate title'
        }
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap order state bar', async () => {
    const { baseElement } = customRender({
      isEmpty: false,
      barData: typeItemData,
      legendData: typeItemData,
      localData: {
        tooltip: {
          numTitle: 'num state title',
          rateTitle: 'num state title'
        }
      },
      maxVal: {
        key: 'c1',
        value: 50
      }
    });
    expect(baseElement).toMatchSnapshot();

    const barLine = getAllBySelector('.bar-line td', baseElement);
    expect(barLine.length).toBe(typeItemData.length);
    fireEvent.mouseOver(barLine[0]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
