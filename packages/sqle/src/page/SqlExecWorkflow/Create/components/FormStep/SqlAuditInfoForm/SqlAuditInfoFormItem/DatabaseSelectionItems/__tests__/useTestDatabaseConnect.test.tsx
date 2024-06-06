import { act, renderHook } from '@testing-library/react';
import useTestDatabaseConnect from '../hooks/useTestDatabaseConnect';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instance from '../../../../../../../../../testUtils/mockApi/instance';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { superRender } from '../../../../../../../../../testUtils/customRender';

describe('test useTestDatabaseConnect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should initialize with correct states', () => {
    const { result } = renderHook(() =>
      useTestDatabaseConnect({
        databaseInfo: [],
        instanceTestConnectResults: { set: jest.fn(), value: [] }
      })
    );
    expect(result.current.testLoading).toBe(false);
    expect(result.current.disabledTestConnect).toBe(true);
  });

  it('should test database connect and update results correctly', async () => {
    const mockBatchCheckInstanceIsConnectableByName =
      instance.batchCheckInstanceIsConnectableByName();
    const setMock = jest.fn();
    const { result } = renderHook(() =>
      useTestDatabaseConnect({
        databaseInfo: [{ instanceName: 'mysql-1' }],
        instanceTestConnectResults: { set: setMock, value: [] }
      })
    );

    await act(async () => {
      result.current.testDatabaseConnect();
    });

    expect(mockBatchCheckInstanceIsConnectableByName).toHaveBeenCalledWith({
      instances: [{ name: 'mysql-1' }],
      project_name: mockProjectInfo.projectName
    });

    await act(() => jest.advanceTimersByTime(3000));

    expect(setMock).toHaveBeenCalledWith([
      { instance_name: 'mysql-1', is_instance_connectable: true }
    ]);
  });

  it('should render test database connect info correctly with connect succeed ', () => {
    const { result } = renderHook(() =>
      useTestDatabaseConnect({
        databaseInfo: [],
        instanceTestConnectResults: {
          set: jest.fn(),
          value: [{ instance_name: 'mysql-1', is_instance_connectable: true }]
        }
      })
    );

    const { container, getByText } = superRender(
      result.current.renderTestDatabasesConnectInfo('mysql-1')
    );
    expect(getByText('数据源连通性测试成功')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render test database connect info correctly with connect failed ', () => {
    const { result } = renderHook(() =>
      useTestDatabaseConnect({
        databaseInfo: [],
        instanceTestConnectResults: {
          set: jest.fn(),
          value: [{ instance_name: 'mysql-1', is_instance_connectable: false }]
        }
      })
    );

    const { container, queryByText } = superRender(
      result.current.renderTestDatabasesConnectInfo('mysql-1')
    );
    expect(queryByText('数据源连通性测试成功')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
