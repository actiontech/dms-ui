import { cleanup, renderHook } from '@testing-library/react-hooks';
import useChatsDataByAPI from './useChatsDataByAPI';
import { sqleLightTheme } from '../../../theme/light';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import statistic from '@actiontech/shared/lib/api/sqle/service/statistic';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import projectOverview from '../../../testUtils/mockApi/projectOverview';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe.skip('useChatsDataByAPI', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should send request', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    const { result } = renderHook(() =>
      useChatsDataByAPI(
        () =>
          statistic.statisticsAuditedSQLV1({
            project_name: mockProjectInfo.projectName
          }),
        {
          onSuccess: (res) => {
            return res;
          }
        }
      )
    );
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    expect(result.current.getApiData).toBeCalledWith({
      project_name: mockProjectInfo.projectName
    });
  });

  test('request failed', async () => {
    const request = projectOverview.getStatisticsAuditedSQL();
    const { result } = renderHook(() =>
      useChatsDataByAPI(
        () =>
          statistic.statisticsAuditedSQLV1({
            project_name: mockProjectInfo.projectName
          }),
        {
          onSuccess: (res) => {
            console.log(res);
            return res;
          }
        }
      )
    );
    request.mockImplementation(() => Promise.reject('error'));
    // request.mockImplementation(() =>
    //   createSpySuccessResponse({
    //     code: 500,
    //     message: 'error'
    //   })
    // );
    expect(result.current.errorMessage).toBe('error');
  });
});
