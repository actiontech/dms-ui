import useCurrentUser from '.';
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { SupportTheme, SystemRole } from '../../enum';
import { useDispatch } from 'react-redux';
import { IUidWithName, IUserBindProject } from '../../api/base/service/common';

export const mockBindProjects: IUserBindProject[] = [
  {
    is_manager: true,
    project_id: '700001',
    project_name: 'default'
  },
  {
    is_manager: false,
    project_id: '100101',
    project_name: 'test'
  }
];

export const mockManagementPermissions: IUidWithName[] = [
  {
    uid: '700001',
    name: '创建项目'
  }
];

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('hooks/useCurrentUser', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn());
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should return true while role is admin', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { role: SystemRole.admin, bindProjects: mockBindProjects }
      });
    });
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.isAdmin).toBeTruthy();
  });

  test('should judge whether project manager based on bound project data and the current project name', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          username: 'test',
          role: SystemRole.admin,
          bindProjects: mockBindProjects,
          managementPermissions: mockManagementPermissions,
          theme: SupportTheme.LIGHT
        }
      });
    });

    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.bindProjects).toEqual(mockBindProjects);
    expect(result.current.username).toBe('test');
    expect(result.current.managementPermissions).toEqual(
      mockManagementPermissions
    );
    expect(result.current.theme).toBe(SupportTheme.LIGHT);
    expect(result.current.role).toBe(SystemRole.admin);
    expect(result.current.isProjectManager('test')).toBeFalsy();
    expect(result.current.isProjectManager('unknown')).toBeFalsy();
    expect(result.current.isProjectManager('default')).toBeTruthy();
    expect(result.current.isCertainProjectManager).toBeTruthy();
    expect(result.current.userRoles).toEqual({
      [SystemRole.admin]: true,
      [SystemRole.certainProjectManager]: true
    });
  });

  test('when current user not admin or certain project manager', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          username: 'test',
          role: '',
          bindProjects: [
            {
              is_manager: false,
              project_id: '700001',
              project_name: 'default'
            }
          ],
          managementPermissions: mockManagementPermissions,
          theme: SupportTheme.LIGHT
        }
      });
    });

    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.isCertainProjectManager).toBeFalsy();
    expect(result.current.isCertainProjectManager).toBeFalsy();
    expect(result.current.userRoles).toEqual({
      [SystemRole.admin]: false,
      [SystemRole.certainProjectManager]: false
    });
  });
});
