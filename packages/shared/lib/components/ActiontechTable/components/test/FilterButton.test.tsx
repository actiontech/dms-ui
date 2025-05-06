import { superRender } from '../../../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import FilterButton from '../FilterButton';
import { TableFilterButtonProps } from '../../index.type';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('lib/ActiontechTable-FilterButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('render hasSelectedFilter', () => {
    const params: TableFilterButtonProps = {
      filterButtonMeta: new Map([
        [
          'demo',
          {
            dataIndex: 'demo',
            filterCustomType: 'select',
            filterKey: 'a1',
            filterLabel: 'label名称',
            checked: false
          }
        ]
      ]),
      updateAllSelectedFilterItem: jest.fn()
    };
    const { baseElement } = superRender(<FilterButton {...params} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render disabled filter button', () => {
    const params: TableFilterButtonProps = {
      filterButtonMeta: new Map([
        [
          'demo',
          {
            dataIndex: 'demo',
            filterCustomType: 'select',
            filterKey: 'a1',
            filterLabel: 'label名称',
            checked: false
          }
        ]
      ]),
      updateAllSelectedFilterItem: jest.fn(),
      disabled: true
    };
    const { baseElement } = superRender(<FilterButton {...params} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render click filter btn', async () => {
    const updateAllSelectedFilterItemFn = jest.fn();
    const params: TableFilterButtonProps = {
      filterButtonMeta: new Map([
        [
          'demo',
          {
            dataIndex: 'demo',
            filterCustomType: 'select',
            filterKey: 'a1',
            filterLabel: 'label名称',
            checked: true
          }
        ]
      ]),
      updateAllSelectedFilterItem: updateAllSelectedFilterItemFn
    };
    const { baseElement } = superRender(<FilterButton {...params} />);
    expect(baseElement).toMatchSnapshot();
    const filterBtn = getBySelector(
      '.actiontech-filter-button-namespace',
      baseElement
    );
    await act(async () => {
      fireEvent.click(filterBtn);
      await jest.advanceTimersByTime(300);
    });
    expect(updateAllSelectedFilterItemFn).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
