import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import Transit from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useSearchParams: jest.fn()
}));

describe('Transit Component', () => {
  const mockNavigate = jest.fn();
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  const originOutputError = console.error;

  beforeEach(() => {
    mockUseCurrentUser();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  beforeAll(() => {
    console.error = () => {
      return;
    };
  });

  afterAll(() => {
    console.error = originOutputError;
  });

  it('should navigate to / when required parameters are missing', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'cloudbeaver'
      })
    ]);
    superRender(<Transit />);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when projectName is undefined', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'cloudbeaver',
        to: 'create_workflow',
        compression_data: 'data'
      })
    ]);
    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when projectName is not found in bindProjects', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'cloudbeaver',
        to: 'create_workflow',
        project_name: 'test',
        compression_data: 'data'
      })
    ]);
    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: '400',
          project_name: 'defa',
          is_manager: false,
          archived: false
        }
      ]
    });
    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when from is unknown', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'other',
        to: 'workflow',
        project_name: 'default',
        compression_data: 'data'
      })
    ]);

    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when target path is undefined', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'cloudbeaver',
        to: 'workflow',
        project_name: 'default',
        compression_data: 'data'
      })
    ]);

    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to the correct target path when all parameters are valid', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        from: 'cloudbeaver',
        to: 'create_workflow',
        project_name: 'default',
        compression_data: 'data'
      })
    ]);
    superRender(<Transit />);
    const projectID = mockCurrentUserReturn.bindProjects.find(
      (v) => v.project_name === 'default'
    )?.project_id!;

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/create?from=cloudbeaver&compression_data=data`,
      { replace: true }
    );
  });
});
