import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { superRender } from '../../testUtil/customRender';
import { getBySelector } from '../../testUtil/customQuery';
import CustomInput from './CustomInput';
import { CustomInputProps } from './CustomInput.types';

describe('lib/CustomInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: CustomInputProps) => {
    return superRender(<CustomInput {...params} />);
  };

  it('should render ui snap by default params', () => {
    customRender({
      prefix: '自定义前缀',
      onCustomPressEnter: jest.fn()
    });
    expect(screen.getByText('自定义前缀')).toBeInTheDocument();
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
    expect(onPressEnterFn).toHaveBeenCalled();
    expect(onPressEnterFn).toHaveBeenCalledTimes(1);
  });
});
