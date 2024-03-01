import { ICustomInputProps } from '@actiontech/shared/lib/components/CustomInput';
import CustomSearchInput from './CustomSearchInput';

import { renderWithTheme } from '../../../testUtils/customRender';
import { cleanup, fireEvent, act } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

describe('sqle/components/RuleDetail/CustomSearchInput', () => {
  const onCustomPressEnterFn = jest.fn();
  const customRender = (params: ICustomInputProps) => {
    return renderWithTheme(<CustomSearchInput {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender({
      onCustomPressEnter: onCustomPressEnterFn,
      value: 'text a'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when enter press', async () => {
    const { baseElement } = customRender({
      onCustomPressEnter: onCustomPressEnterFn,
      value: 'text 1'
    });

    const iconSearch = getBySelector('.pointer', baseElement);
    fireEvent.click(iconSearch);
    await act(async () => jest.advanceTimersByTime(500));
    expect(onCustomPressEnterFn).toHaveBeenCalled();
  });

  it('render snap when dispatch event', async () => {
    const { baseElement } = customRender({
      onCustomPressEnter: onCustomPressEnterFn,
      value: 'text 2'
    });

    const inputEle = getBySelector('.custom-search-input input', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: '13214334343'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
    });
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(500));
    });
    expect(onCustomPressEnterFn).toHaveBeenCalled();

    await act(async () => {
      EventEmitter.emit(EmitterKey.Search_Rule_Template_Rule_Clear_Value);
      await act(async () => jest.advanceTimersByTime(500));
    });
  });
});
