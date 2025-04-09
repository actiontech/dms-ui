import { fireEvent, act, cleanup } from '@testing-library/react';
import { superRender } from '../../../testUtil/customRender';

import { ConfigItemEditInputNumberProps } from '../ConfigItem.types';
import EditInputNumber from '../components/EditInputNumber';
import { getBySelector } from '../../../testUtil/customQuery';

describe('lib/ConfigItem-EditInputNumber', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ConfigItemEditInputNumberProps) => {
    return superRender(<EditInputNumber {...params} />);
  };

  it('render loading is true', () => {
    const { baseElement } = customRender({
      submitLoading: true,
      fieldValue: 1,
      hideField: jest.fn(),
      onSubmit: jest.fn()
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render input for error', async () => {
    const validatorFn = jest.fn().mockReturnValue(false);
    const { baseElement } = customRender({
      fieldValue: 1,
      hideField: jest.fn(),
      onSubmit: jest.fn(),
      validator: validatorFn
    });
    const inputEle = getBySelector(
      'input.ant-input-number-input#editInputNumber',
      baseElement
    );
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(validatorFn).toHaveBeenCalledTimes(1);
  });

  it('render input enter key', async () => {
    const validatorFn = jest.fn().mockReturnValue(true);
    const onSubmitFn = jest.fn();
    const { baseElement } = customRender({
      fieldValue: 3,
      hideField: jest.fn(),
      onSubmit: onSubmitFn,
      validator: validatorFn
    });
    const inputEle = getBySelector(
      'input.ant-input-number-input#editInputNumber',
      baseElement
    );
    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    expect(validatorFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn).toHaveBeenCalledWith(3);
  });

  it('render input esc key', async () => {
    const hideFieldFn = jest.fn();
    const { baseElement } = customRender({
      fieldValue: 3,
      hideField: hideFieldFn,
      onSubmit: jest.fn()
    });
    const inputEle = getBySelector(
      'input.ant-input-number-input#editInputNumber',
      baseElement
    );
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

  it('render input val change', async () => {
    const { baseElement } = customRender({
      fieldValue: 4,
      hideField: jest.fn(),
      onSubmit: jest.fn()
    });
    const inputEle = getBySelector(
      'input.ant-input-number-input#editInputNumber',
      baseElement
    );
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 0
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveValue('0');

    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 99
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(inputEle).toHaveValue('99');
  });

  it('render input val change and click select icon', async () => {
    const onSubmitFn = jest.fn();
    const { baseElement } = customRender({
      fieldValue: 4,
      hideField: jest.fn(),
      onSubmit: onSubmitFn
    });
    const inputEle = getBySelector(
      'input.ant-input-number-input#editInputNumber',
      baseElement
    );
    fireEvent.change(inputEle, {
      target: {
        value: 0
      }
    });

    expect(inputEle).toHaveValue('0');
    await act(async () => {
      fireEvent.click(getBySelector('.custom-icon-selected'));
      await jest.advanceTimersByTime(300);
    });
    expect(onSubmitFn).toHaveBeenCalledTimes(1);
    expect(onSubmitFn).toHaveBeenCalledWith(0);
  });
});
