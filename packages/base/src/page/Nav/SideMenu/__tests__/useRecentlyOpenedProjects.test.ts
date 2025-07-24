import { LocalStorageWrapper } from '@actiontech/shared';
import { act, renderHook } from '@testing-library/react';
import useRecentlyOpenedProjects from '../useRecentlyOpenedProjects';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { StorageKey } from '@actiontech/shared/lib/enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';

describe('test useRecentlyOpenedProjects.test', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const username1 = 'admin';
  const username2 = 'test';

  const bindProjects = [
    {
      is_manager: true,
      project_name: 'default',
      project_id: '300',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'default1',
      project_id: '400',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'default2',
      project_id: '500',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'default3',
      project_id: '600',
      archived: false
    },
    {
      is_manager: false,
      project_name: 'default4',
      project_id: '700',
      archived: false
    }
  ];

  it('should output error message when "JSON.parse" throws an exception', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    LocalStorageWrapperGetSpy.mockReturnValue('');

    const { result } = renderHook(() => useRecentlyOpenedProjects());

    expect(result.current.recentlyProjects).toEqual([]);

    LocalStorageWrapperGetSpy.mockReturnValue(
      '{admin: [{project_id:1, project_name:"default"}]'
    );

    renderHook(() => useRecentlyOpenedProjects());
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('should perform as expected with update operation', () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    mockUseCurrentUser({
      username: username1,
      bindProjects
    });
    const LocalStorageWrapperSetSpy = jest.spyOn(LocalStorageWrapper, 'set');
    const { result } = renderHook(() => useRecentlyOpenedProjects());

    expect(emitSpy).toHaveBeenCalledTimes(0);
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.updateRecentlyProject('401', 'not_bind_project');
    });

    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.updateRecentlyProject('400', 'default1');
    });
    expect(result.current.currentProjectID).toBe('400');
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenNthCalledWith(
      1,
      EmitterKey.Update_Current_Project_ID,
      '400'
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      2,
      EmitterKey.Update_Recently_Opened_Projects,
      {
        [username1]: [{ project_id: '400', project_name: 'default1' }]
      }
    );
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(1);
    expect(LocalStorageWrapperSetSpy).toHaveBeenNthCalledWith(
      1,
      StorageKey.DMS_Project_Catch,
      JSON.stringify({
        [username1]: [{ project_id: '400', project_name: 'default1' }]
      })
    );

    expect(result.current.recentlyProjects).toEqual([
      { project_id: '400', project_name: 'default1' }
    ]);

    act(() => {
      result.current.updateRecentlyProject('500', 'default2');
    });

    expect(result.current.currentProjectID).toBe('500');
    expect(emitSpy).toHaveBeenCalledTimes(4);
    expect(emitSpy).toHaveBeenNthCalledWith(
      3,
      EmitterKey.Update_Current_Project_ID,
      '500'
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      4,
      EmitterKey.Update_Recently_Opened_Projects,
      {
        [username1]: [
          { project_id: '500', project_name: 'default2' },
          { project_id: '400', project_name: 'default1' }
        ]
      }
    );
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(2);
    expect(LocalStorageWrapperSetSpy).toHaveBeenNthCalledWith(
      2,
      StorageKey.DMS_Project_Catch,
      JSON.stringify({
        [username1]: [
          { project_id: '500', project_name: 'default2' },
          { project_id: '400', project_name: 'default1' }
        ]
      })
    );

    expect(result.current.recentlyProjects).toEqual([
      { project_id: '500', project_name: 'default2' },
      { project_id: '400', project_name: 'default1' }
    ]);

    act(() => {
      result.current.updateRecentlyProject('600', 'default3');
    });

    expect(result.current.currentProjectID).toBe('600');
    expect(emitSpy).toHaveBeenCalledTimes(6);
    expect(emitSpy).toHaveBeenNthCalledWith(
      5,
      EmitterKey.Update_Current_Project_ID,
      '600'
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      6,
      EmitterKey.Update_Recently_Opened_Projects,
      {
        [username1]: [
          { project_id: '600', project_name: 'default3' },
          { project_id: '500', project_name: 'default2' },
          { project_id: '400', project_name: 'default1' }
        ]
      }
    );
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(3);
    expect(LocalStorageWrapperSetSpy).toHaveBeenNthCalledWith(
      3,
      StorageKey.DMS_Project_Catch,
      JSON.stringify({
        [username1]: [
          { project_id: '600', project_name: 'default3' },
          { project_id: '500', project_name: 'default2' },
          { project_id: '400', project_name: 'default1' }
        ]
      })
    );

    expect(result.current.recentlyProjects).toEqual([
      { project_id: '600', project_name: 'default3' },
      { project_id: '500', project_name: 'default2' },
      { project_id: '400', project_name: 'default1' }
    ]);

    act(() => {
      result.current.updateRecentlyProject('700', 'default4');
    });

    expect(result.current.currentProjectID).toBe('700');
    expect(emitSpy).toHaveBeenCalledTimes(8);
    expect(emitSpy).toHaveBeenNthCalledWith(
      7,
      EmitterKey.Update_Current_Project_ID,
      '700'
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      8,
      EmitterKey.Update_Recently_Opened_Projects,
      {
        [username1]: [
          { project_id: '700', project_name: 'default4' },
          { project_id: '600', project_name: 'default3' },
          { project_id: '500', project_name: 'default2' }
        ]
      }
    );
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(4);
    expect(LocalStorageWrapperSetSpy).toHaveBeenNthCalledWith(
      4,
      StorageKey.DMS_Project_Catch,
      JSON.stringify({
        [username1]: [
          { project_id: '700', project_name: 'default4' },
          { project_id: '600', project_name: 'default3' },
          { project_id: '500', project_name: 'default2' }
        ]
      })
    );

    expect(result.current.recentlyProjects).toEqual([
      { project_id: '700', project_name: 'default4' },
      { project_id: '600', project_name: 'default3' },
      { project_id: '500', project_name: 'default2' }
    ]);

    act(() => {
      result.current.updateRecentlyProject('600', 'default3');
    });

    expect(result.current.currentProjectID).toBe('600');
    expect(emitSpy).toHaveBeenCalledTimes(10);
    expect(emitSpy).toHaveBeenNthCalledWith(
      9,
      EmitterKey.Update_Current_Project_ID,
      '600'
    );
    expect(emitSpy).toHaveBeenNthCalledWith(
      10,
      EmitterKey.Update_Recently_Opened_Projects,
      {
        [username1]: [
          { project_id: '600', project_name: 'default3' },
          { project_id: '700', project_name: 'default4' },
          { project_id: '500', project_name: 'default2' }
        ]
      }
    );
    expect(LocalStorageWrapperSetSpy).toHaveBeenCalledTimes(5);
    expect(LocalStorageWrapperSetSpy).toHaveBeenNthCalledWith(
      5,
      StorageKey.DMS_Project_Catch,
      JSON.stringify({
        [username1]: [
          { project_id: '600', project_name: 'default3' },
          { project_id: '700', project_name: 'default4' },
          { project_id: '500', project_name: 'default2' }
        ]
      })
    );

    expect(result.current.recentlyProjects).toEqual([
      { project_id: '600', project_name: 'default3' },
      { project_id: '700', project_name: 'default4' },
      { project_id: '500', project_name: 'default2' }
    ]);
  });

  it('should be an empty array when no update operation is performed', () => {
    const subscribeSpy = jest.spyOn(EventEmitter, 'subscribe');
    const unsubscribeSpy = jest.spyOn(EventEmitter, 'unsubscribe');

    const { result, unmount } = renderHook(() => useRecentlyOpenedProjects());

    expect(result.current.recentlyProjects).toEqual([]);

    expect(unsubscribeSpy).toHaveBeenCalledTimes(0);
    expect(subscribeSpy).toHaveBeenCalledTimes(2);
    expect(subscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.Update_Recently_Opened_Projects
    );
    expect(subscribeSpy.mock.calls[1][0]).toBe(
      EmitterKey.Update_Current_Project_ID
    );

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    expect(unsubscribeSpy.mock.calls[0][0]).toBe(
      EmitterKey.Update_Recently_Opened_Projects
    );
    expect(unsubscribeSpy.mock.calls[1][0]).toBe(
      EmitterKey.Update_Current_Project_ID
    );
  });

  it('should test getRecentlyProjectId method behavior', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const LocalStorageWrapperGetSpy = jest.spyOn(LocalStorageWrapper, 'get');

    // Test case 1: when localStorage is empty
    LocalStorageWrapperGetSpy.mockReturnValue('');
    mockUseCurrentUser({
      username: username1,
      bindProjects
    });

    const { result } = renderHook(() => useRecentlyOpenedProjects());

    expect(result.current.getRecentlyProjectId()).toBeUndefined();

    // Test case 2: when localStorage has valid data but no matching bind projects
    LocalStorageWrapperGetSpy.mockReturnValue(
      JSON.stringify({
        [username1]: [{ project_id: '999', project_name: 'non_bind_project' }]
      })
    );

    expect(result.current.getRecentlyProjectId()).toBeUndefined();

    // Test case 3: when localStorage has valid data with matching bind projects
    LocalStorageWrapperGetSpy.mockReturnValue(
      JSON.stringify({
        [username1]: [
          { project_id: '400', project_name: 'default1' },
          { project_id: '300', project_name: 'default' }
        ]
      })
    );

    expect(result.current.getRecentlyProjectId()).toBe('400');

    // Test case 4: when localStorage has invalid JSON data
    LocalStorageWrapperGetSpy.mockReturnValue('{invalid json}');

    expect(result.current.getRecentlyProjectId()).toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();

    // Test case 5: when user has no recently opened projects for current username
    LocalStorageWrapperGetSpy.mockReturnValue(
      JSON.stringify({
        [username2]: [{ project_id: '400', project_name: 'default1' }]
      })
    );

    expect(result.current.getRecentlyProjectId()).toBeUndefined();

    // Test case 6: when localStorage has projects but none match current user's bind projects
    LocalStorageWrapperGetSpy.mockReturnValue(
      JSON.stringify({
        [username1]: [
          { project_id: '888', project_name: 'non_bind1' },
          { project_id: '999', project_name: 'non_bind2' }
        ]
      })
    );

    expect(result.current.getRecentlyProjectId()).toBeUndefined();
  });
});
