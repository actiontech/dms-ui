import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch } from 'react-redux';
import { cleanup, act } from '@testing-library/react';
import useWhitelistRedux from '../useWhitelistRedux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockProjectInfo,
  mockCurrentUserReturn
} from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('sqle/Whitelist/hooks/useWhitelistRedux', () => {
  let useCurrentUserSpy: jest.SpyInstance;
  let useCurrentProjectSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    useCurrentProjectSpy = mockUseCurrentProject();
    useCurrentUserSpy = mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render open create sql management exception modal', async () => {
    const { result } = renderHooksWithTheme(() => useWhitelistRedux());

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
    const { result } = renderHooksWithTheme(() => useWhitelistRedux());

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

  it('render actionPermission is true when current user is admin', async () => {
    const { result } = renderHooksWithTheme(() => useWhitelistRedux());

    expect(result.current.actionPermission).toBeTruthy();
  });

  it('render actionPermission is true when current user is project manager', async () => {
    useCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isAdmin: false,
      isProjectManager: jest.fn().mockImplementation(() => true)
    }));
    const { result } = renderHooksWithTheme(() => useWhitelistRedux());

    expect(result.current.actionPermission).toBeTruthy();
  });

  it('render actionPermission is false when project is archived', async () => {
    useCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    const { result } = renderHooksWithTheme(() => useWhitelistRedux());

    expect(result.current.actionPermission).toBeFalsy();
  });
});
