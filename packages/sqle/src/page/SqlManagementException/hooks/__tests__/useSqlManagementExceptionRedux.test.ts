import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch } from 'react-redux';
import { cleanup, act } from '@testing-library/react';
import useSqlManagementExceptionRedux from '../useSqlManagementExceptionRedux';
import { ModalName } from '../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle/SqlManagementException/hooks/useSqlManagementExceptionRedux', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render open create sql management exception modal', async () => {
    const { result } = superRenderHook(() => useSqlManagementExceptionRedux());

    act(() => {
      result.current.openCreateSqlManagementExceptionModal();
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateModalStatus',
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: true
      }
    });
  });

  it('render update Select Sql Management Exception Record', async () => {
    const { result } = superRenderHook(() => useSqlManagementExceptionRedux());

    act(() => {
      result.current.updateSelectSqlManagementExceptionRecord({
        content: 'test sql'
      });
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'sqlManagementException/updateSelectSqlManagementException',
      payload: {
        selectRow: {
          content: 'test sql'
        }
      }
    });
  });
});
