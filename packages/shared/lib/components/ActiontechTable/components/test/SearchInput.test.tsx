import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtil/customRender';

import { TableSearchInputProps } from '../../index.type';
import SearchInput from '../SearchInput';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('lib/ActiontechTable-SearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: TableSearchInputProps) => {
    return renderWithTheme(<SearchInput {...params} />);
  };

  it('render search input ui', () => {
    const { baseElement } = customRender({
      className: 'custom-search-input-box',
      onChange: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render change & refresh fn', async () => {
    const onChangeFn = jest.fn();
    const { baseElement } = customRender({
      onChange: onChangeFn
    });
    const inputEle = getBySelector('.ant-input', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: '11'
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toBeCalledTimes(1);

    const iconSearch = getBySelector('.custom-icon-search', baseElement);
    await act(async () => {
      fireEvent.click(iconSearch);
      await jest.advanceTimersByTime(300);
    });
  });

  it('render enter key fn', async () => {
    const { baseElement } = customRender({
      onChange: jest.fn()
    });
    const inputEle = getBySelector('.ant-input', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: '11'
        }
      });
      await jest.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
  });
});
