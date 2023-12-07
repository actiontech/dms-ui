import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtil/customRender';

import { IConfigItemEditInputNumberProps } from '../index.type';
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

  const customRender = (params: IConfigItemEditInputNumberProps) => {
    return renderWithTheme(<EditInputNumber {...params} />);
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
    expect(validatorFn).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
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
    expect(validatorFn).toBeCalledTimes(1);
    expect(onSubmitFn).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
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
    expect(hideFieldFn).toBeCalledTimes(1);
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
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 99
        }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
