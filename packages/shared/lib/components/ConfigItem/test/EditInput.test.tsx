import { getBySelector } from '../../../testUtil/customQuery';
import { renderWithTheme } from '../../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import EditInput from '../components/EditInput';
import { IConfigItemEditInputProps } from '../index.type';

describe('lib/ConfigItem-EditInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: IConfigItemEditInputProps) => {
    return renderWithTheme(<EditInput {...params} />);
  };

  it('render loading is true', () => {
    const { baseElement } = customRender({
      submitLoading: true,
      fieldValue: 'default val',
      hideField: jest.fn(),
      onSubmit: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render input val change', async () => {
    const hideFieldFn = jest.fn();
    const onSubmitFn = jest.fn();
    const { baseElement } = customRender({
      submitLoading: false,
      fieldValue: 'default val',
      hideField: hideFieldFn,
      onSubmit: onSubmitFn
    });
    expect(baseElement).toMatchSnapshot();
    const inputEle = getBySelector('#editInput', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 'val1'
        }
      });
      await jest.advanceTimersByTime(300);
    });
  });

  it('render input for error', async () => {
    const validatorFn = jest.fn().mockReturnValue(false);
    const { baseElement } = customRender({
      fieldValue: '1',
      hideField: jest.fn(),
      onSubmit: jest.fn(),
      validator: validatorFn
    });
    const inputEle = getBySelector('input.ant-input#editInput', baseElement);
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(validatorFn).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('render input for key', async () => {
    const hideFieldFn = jest.fn();
    const onSubmitFn = jest.fn();
    const { baseElement } = customRender({
      submitLoading: false,
      fieldValue: 'default val',
      hideField: hideFieldFn,
      onSubmit: onSubmitFn
    });
    const inputEle = getBySelector('input.ant-input#editInput', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 'val key'
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onSubmitFn).toBeCalledTimes(1);

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27
      });
      await jest.advanceTimersByTime(300);
    });
    expect(hideFieldFn).toBeCalledTimes(1);
  });
});
