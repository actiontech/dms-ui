import { getBySelector } from '../../../testUtil/customQuery';
import { superRender } from '../../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import EditInput from '../components/EditInput';
import { ConfigItemEditInputProps } from '../ConfigItem.types';

describe('lib/ConfigItem-EditInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: ConfigItemEditInputProps) => {
    return superRender(<EditInput {...params} />);
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
    expect(validatorFn).toHaveBeenCalledTimes(1);
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
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onSubmitFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27
      });
      await jest.advanceTimersByTime(300);
    });
    expect(hideFieldFn).toHaveBeenCalledTimes(1);
  });

  it('render input and click select icon', async () => {
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
    await act(async () => {
      fireEvent.click(getBySelector('.custom-icon-selected'));
      await jest.advanceTimersByTime(300);
    });
    expect(onSubmitFn).toHaveBeenCalledTimes(1);
  });
});
