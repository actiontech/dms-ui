import { getBySelector } from '../../../../testUtil/customQuery';
import { superRender } from '../../../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import ColumnsItems, { IColumnsItems, typeFixed } from '../ColumnsItems';

const columnsData = {
  dataIndex: 'test1',
  numberVal: 1,
  data: {
    show: true,
    title: '这是标题',
    order: 1,
    dataIndex: 'test1'
  }
};

describe('lib/ActiontechTable-ColumnsItems', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: IColumnsItems<Record<string, any>>) => {
    return superRender(<ColumnsItems {...params} />);
  };

  it('render column item left | right', () => {
    const { baseElement } = customRender({
      ...columnsData,
      type: 'left' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      ...columnsData,
      type: 'right' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: jest.fn()
    });
    expect(baseElement1).toMatchSnapshot();
  });

  it('render column item no-fixed', () => {
    const { baseElement } = customRender({
      ...columnsData,
      type: 'no-fixed' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render type left fn click call back', async () => {
    const onFixedClickFn = jest.fn();
    const { baseElement } = customRender({
      ...columnsData,
      type: 'left' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: onFixedClickFn
    });

    const fixedIcon = getBySelector(
      '.fixed-icon.anticon-vertical-align-middle',
      baseElement
    );
    await act(async () => {
      fireEvent.click(fixedIcon);
      await jest.advanceTimersByTime(300);
    });
    expect(onFixedClickFn).toHaveBeenCalledTimes(1);
    expect(onFixedClickFn).toHaveBeenCalledWith(
      'no-fixed',
      columnsData.dataIndex
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render type no-fixed fn click call back', async () => {
    const onFixedClickFn = jest.fn();
    const { baseElement } = customRender({
      ...columnsData,
      type: 'no-fixed' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: onFixedClickFn
    });

    const fixedIcon = getBySelector(
      '.fixed-icon.anticon-vertical-align-top',
      baseElement
    );
    await act(async () => {
      fireEvent.click(fixedIcon);
      await jest.advanceTimersByTime(300);
    });
    expect(onFixedClickFn).toHaveBeenCalledTimes(1);
    expect(onFixedClickFn).toHaveBeenCalledWith('left', columnsData.dataIndex);
    expect(baseElement).toMatchSnapshot();
  });

  it('render type right fn click call back', async () => {
    const onFixedClickFn = jest.fn();
    const { baseElement } = customRender({
      ...columnsData,
      type: 'right' as typeFixed,
      onShowChange: jest.fn(),
      onFixedClick: onFixedClickFn
    });

    const fixedIcon = getBySelector(
      '.fixed-icon.anticon-vertical-align-bottom',
      baseElement
    );
    await act(async () => {
      fireEvent.click(fixedIcon);
      await jest.advanceTimersByTime(300);
    });
    expect(onFixedClickFn).toHaveBeenCalledTimes(1);
    expect(onFixedClickFn).toHaveBeenCalledWith('right', columnsData.dataIndex);
    expect(baseElement).toMatchSnapshot();
  });
});
