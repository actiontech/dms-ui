import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';

import CustomInput, { ICustomInputProps } from '.';
import { getBySelector } from '../../testUtil/customQuery';

describe('lib/CustomInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ICustomInputProps) => {
    return renderWithTheme(<CustomInput {...params} />);
  };

  it('should render ui snap by default params', () => {
    const { container } = customRender({
      prefix: '自定义前缀',
      onCustomPressEnter: jest.fn()
    });
    expect(container).toMatchSnapshot();
  });

  it('should be trigger onCustomPressEnter', async () => {
    const onPressEnterFn = jest.fn();
    const { container, baseElement } = customRender({
      prefix: '自定义前缀',
      placeholder: '自定义placeholder',
      onCustomPressEnter: onPressEnterFn
    });

    const inputEle = getBySelector('.ant-input', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: { value: 'test-val' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();
    await act(async () => {
      fireEvent.keyDown(getBySelector('input.ant-input', baseElement), {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onPressEnterFn).toBeCalled();
    expect(onPressEnterFn).toBeCalledTimes(1);
  });
});
