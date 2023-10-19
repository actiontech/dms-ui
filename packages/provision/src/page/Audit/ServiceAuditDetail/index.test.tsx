import { act, cleanup, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import ServiceAuditDetail from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('/audit/serviceDetail', () => {
  let listDataObjectServiceEventsSpy: jest.SpyInstance;
  beforeEach(() => {
    listDataObjectServiceEventsSpy = auth.listDataObjectServiceEvents();
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });
  it('should match snapshot', async () => {
    const { container } = superRender(
      <Routes>
        <Route path="/audit/service/:id" element={<ServiceAuditDetail />} />
      </Routes>,
      {},
      {
        routerProps: {
          initialEntries: ['/audit/service/123']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(listDataObjectServiceEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_event_uid: '123',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
    expect(container).toMatchSnapshot();

    await screen.findByText('数据源操作详情');
    await act(async () => jest.advanceTimersByTime(200));

    expect(container).toMatchSnapshot();
  });
});
