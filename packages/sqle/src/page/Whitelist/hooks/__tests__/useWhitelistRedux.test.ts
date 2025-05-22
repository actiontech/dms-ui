import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch } from 'react-redux';
import { cleanup, act } from '@testing-library/react';
import useWhitelistRedux from '../useWhitelistRedux';
import { ModalName } from '../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle/Whitelist/hooks/useWhitelistRedux', () => {
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
    const { result } = superRenderHook(() => useWhitelistRedux());

    act(() => {
      result.current.openCreateWhitelistModal();
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
        status: true
      }
    });
  });

  it('render update Select Sql Management Exception Record', async () => {
    const { result } = superRenderHook(() => useWhitelistRedux());

    act(() => {
      result.current.updateSelectWhitelistRecord({
        value: 'test sql'
      });
    });

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateSelectWhitelist',
      payload: {
        selectRow: {
          value: 'test sql'
        }
      }
    });
  });
});
