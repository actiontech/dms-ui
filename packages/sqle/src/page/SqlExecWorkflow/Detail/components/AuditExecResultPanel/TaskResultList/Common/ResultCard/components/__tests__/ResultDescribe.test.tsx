import { act, cleanup, fireEvent } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import ResultDescribe from '../ResultDescribe';
import { superRender } from '../../../../../../../../../../testUtils/customRender';

describe('sqle/ExecWorkflow/AuditDetail/ResultDescribe', () => {
  const onSubmitFn = jest.fn();
  const customRender = (value: string = '') => {
    return superRender(<ResultDescribe value={value} onSubmit={onSubmitFn} />);
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
    expect(onSubmitFn).toHaveBeenCalled();
    expect(onSubmitFn).toHaveBeenCalledWith('desc text');
  });
});
