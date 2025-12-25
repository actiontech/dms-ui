/* eslint-disable no-console */
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import Transit from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useTypedNavigate, useTypedQuery } from '@actiontech/shared';

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedNavigate: jest.fn(),
  useTypedQuery: jest.fn()
}));

describe('Transit Component', () => {
  const mockNavigate = jest.fn();
  const mockExtractQueries = jest.fn();
  const originOutputError = console.error;

  beforeEach(() => {
    mockUseCurrentUser();
    mockExtractQueries.mockReset();
    mockNavigate.mockReset();
    (useTypedNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    (useTypedQuery as jest.Mock).mockImplementation(() => mockExtractQueries);
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
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver'
    });
    superRender(<Transit />);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when projectName is undefined', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'create_workflow',
      compression_data: 'data'
    });
    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when projectName is not found in bindProjects', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'create_workflow',
      project_name: 'test',
      compression_data: 'data'
    });
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
    mockExtractQueries.mockReturnValue({
      from: 'other',
      to: 'workflow',
      project_name: 'default',
      compression_data: 'data'
    });

    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to / when target path is undefined', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'workflow',
      project_name: 'default',
      compression_data: 'data'
    });

    superRender(<Transit />);

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should navigate to the correct target path when all parameters are valid', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'create_workflow',
      project_name: 'default',
      compression_data: 'data'
    });
    superRender(<Transit />);
    const projectID = mockCurrentUserReturn.bindProjects.find(
      (v) => v.project_name === 'default'
    )?.project_id!;

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/create?from=cloudbeaver&compression_data=data`,
      { replace: true }
    );
  });

  it('should navigate without compression data when not provided', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'create_workflow',
      project_name: 'default'
    });
    superRender(<Transit />);
    const projectID = mockCurrentUserReturn.bindProjects.find(
      (v) => v.project_name === 'default'
    )?.project_id!;

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/create`,
      { replace: true }
    );
  });

  it('should navigate to workflow detail with workflow id', () => {
    mockExtractQueries.mockReturnValue({
      from: 'cloudbeaver',
      to: 'workflow_detail',
      project_name: 'default',
      workflow_id: 'wf-001'
    });
    superRender(<Transit />);
    const projectID = mockCurrentUserReturn.bindProjects.find(
      (v) => v.project_name === 'default'
    )?.project_id!;

    expect(mockNavigate).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/wf-001`,
      { replace: true }
    );
  });
});
