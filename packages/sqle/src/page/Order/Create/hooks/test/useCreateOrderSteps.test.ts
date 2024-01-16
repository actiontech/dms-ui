import { renderHook, act } from '@testing-library/react';

import useCreateOrderSteps from '../useCreateOrderSteps';

describe('sqle/Order/Create/hooks/useCreateOrderSteps', () => {
  const customRender = () => {
    return renderHook(() => useCreateOrderSteps());
  };

  it('render change order step val', async () => {
    const { result } = customRender();
    expect(result.current.showForm).toBeTruthy();
    expect(result.current.showTasks).toBeFalsy();
    expect(result.current.showResult).toBeFalsy();

    await act(async () => {
      result.current.showTasksAction();
    });
    expect(result.current.showForm).toBeFalsy();
    expect(result.current.showTasks).toBeTruthy();
    expect(result.current.showResult).toBeFalsy();

    await act(async () => {
      result.current.showResultAction();
    });
    expect(result.current.showForm).toBeFalsy();
    expect(result.current.showTasks).toBeFalsy();
    expect(result.current.showResult).toBeTruthy();

    await act(async () => {
      result.current.showFormAction();
    });
    expect(result.current.showForm).toBeTruthy();
    expect(result.current.showTasks).toBeFalsy();
    expect(result.current.showResult).toBeFalsy();
  });
});
