import { fireEvent, act, cleanup } from '@testing-library/react';

import CustomSelectSearchInput from '../CustomSelectSearchInput';
import { renderWithTheme } from '../../../testUtil/customRender';
import { getBySelector } from '../../../testUtil/customQuery';

describe('lib/CustomSelectSearchInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render search input ui', () => {
    const onChangeFn = jest.fn();
    const { container } = renderWithTheme(
      <CustomSelectSearchInput value="test-value" onChange={onChangeFn} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render search value change', async () => {
    const onChangeFn = jest.fn();
    const { container, baseElement } = renderWithTheme(
      <CustomSelectSearchInput onChange={onChangeFn} />
    );
    const inputEle = getBySelector('.ant-input', baseElement);
    await act(async () => {
      fireEvent.change(inputEle, {
        target: { value: 'test-value-change' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toBeCalled();
    expect(onChangeFn).toBeCalledTimes(1);
    expect(container).toMatchSnapshot();
  });
});
