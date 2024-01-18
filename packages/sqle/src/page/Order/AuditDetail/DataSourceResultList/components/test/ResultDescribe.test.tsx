import { renderWithTheme } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent } from '@testing-library/react';

import ResultDescribe from '../ResultDescribe';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/AuditDetail/ResultDescribe', () => {
  const onSubmitFn = jest.fn();
  const customRender = (value: string = '') => {
    return renderWithTheme(
      <ResultDescribe value={value} onSubmit={onSubmitFn} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when value is empty', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has value', async () => {
    const { baseElement } = customRender('this is a desc');
    expect(baseElement).toMatchSnapshot();
    const descInput = getBySelector('input[placeholder="添加说明"]');
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.blur(descInput);
    await act(async () => jest.advanceTimersByTime(300));
    expect(onSubmitFn).toBeCalled();
    expect(onSubmitFn).toBeCalledWith('desc text');
  });
});