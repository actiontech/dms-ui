import { cleanup } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import useOpsTypeEditablePermissions from '../useOpsTypeEditablePermissions';
import {
  OPS_TYPE_EDITABLE_PERMISSIONS_OFF,
  OPS_TYPE_EDITABLE_PERMISSIONS_ON
} from '../permissions';

describe('sqle/hooks/useOpsType/useOpsTypeEditablePermissions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  it('platform admin → all on even when not project manager of that project', () => {
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(false)
    });
    const { result } = superRenderHook(() =>
      useOpsTypeEditablePermissions('other-project')
    );
    expect(result.current).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_ON);
  });

  it('project manager of current project → all on', () => {
    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: jest.fn((name: string) => name === 'default')
    });
    const { result } = superRenderHook(() =>
      useOpsTypeEditablePermissions('default')
    );
    expect(result.current).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_ON);
  });

  it('regular member → all off (no add/update/delete entry)', () => {
    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(false)
    });
    const { result } = superRenderHook(() =>
      useOpsTypeEditablePermissions('default')
    );
    expect(result.current).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_OFF);
  });

  it('missing projectName → member path (all off) when not admin', () => {
    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
    const { result } = superRenderHook(() =>
      useOpsTypeEditablePermissions(undefined)
    );
    expect(result.current).toEqual(OPS_TYPE_EDITABLE_PERMISSIONS_OFF);
  });
});
