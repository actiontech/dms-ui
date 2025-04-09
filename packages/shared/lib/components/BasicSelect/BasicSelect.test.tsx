import { SelectProps } from 'antd';
import { fireEvent, act, cleanup } from '@testing-library/react';
import { superRender } from '../../testUtil/customRender';
import { filterOptionByLabel } from './utils';
import { getAllBySelector, getBySelector } from '../../testUtil/customQuery';
import BasicSelect from './BasicSelect';

describe('lib/BasicSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: SelectProps) => {
    return superRender(<BasicSelect {...params} />);
  };

  it('render diff size select', () => {
    const { container } = customRender({
      size: 'middle'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      size: 'small'
    });
    expect(container1).toMatchSnapshot();

    const { container: container2 } = customRender({
      size: 'large',
      className: 'custom-select-class-name'
    });
    expect(container2).toMatchSnapshot();
  });

  it('render custom filter fn', async () => {
    const { baseElement } = customRender({
      options: [
        {
          label: 'a-b-c',
          value: 'val1'
        },
        {
          label: 'd-e-f',
          value: 'val2'
        }
      ],
      showSearch: true,
      filterOption: filterOptionByLabel,
      placeholder: '可以搜索'
    });

    const searchInputEle = getBySelector(
      '.ant-select-selection-search input',
      baseElement
    );
    await act(async () => {
      fireEvent.mouseDown(searchInputEle);
      await jest.advanceTimersByTime(300);
    });
    expect(
      getAllBySelector('.ant-select-item-option', baseElement).length
    ).toBe(2);
    await act(async () => {
      fireEvent.change(searchInputEle, {
        target: {
          value: 'e-f'
        }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.mouseDown(searchInputEle);
      await jest.advanceTimersByTime(300);
    });

    expect(
      getAllBySelector('.ant-select-item-option', baseElement).length
    ).toBe(1);
    expect(baseElement).toMatchSnapshot();
  });
});
