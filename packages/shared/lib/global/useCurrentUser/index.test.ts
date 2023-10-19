import useCurrentUser from '.';
import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { SupportTheme, SystemRole } from '../../enum';
import { IManagementPermissionResV1 } from '../../types/common.type';
import { useDispatch } from 'react-redux';
import { IUserBindProject } from '../../api/base/service/common';

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

export const mockManagementPermissions: IManagementPermissionResV1[] = [
  {
    code: 1,
    desc: '创建项目'
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
  });
});
