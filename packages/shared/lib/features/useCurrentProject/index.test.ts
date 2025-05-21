import { useParams } from 'react-router-dom';
import useCurrentProject from '.';
import { DEFAULT_PROJECT_NAME } from '../../data/common';
import { superRenderHook } from '../../testUtil/superRender';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useLocation: jest.fn()
}));

describe('useCurrentProject', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({ projectName: DEFAULT_PROJECT_NAME });
  });

  test('should have default value when params is undefined', () => {
    const { result } = superRenderHook(() => useCurrentProject(), undefined, {
      initStore: {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: DEFAULT_PROJECT_NAME
            }
          ],
          managementPermissions: []
        }
      }
    });
    expect(result.current.projectName).toBe(DEFAULT_PROJECT_NAME);
  });

  test('should return value when params is defined', () => {
    useParamsMock.mockReturnValue({ projectName: 'testSpace' });
    const { result } = superRenderHook(() => useCurrentProject(), undefined, {
      initStore: {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: 'testSpace'
            }
          ],
          managementPermissions: []
        }
      }
    });
    expect(result.current.projectName).toBe('testSpace');
  });
});
