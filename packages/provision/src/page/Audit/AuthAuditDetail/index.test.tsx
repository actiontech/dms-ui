import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import AuthAuditDetail from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('/audit/authDetail', () => {
  let listAuthorizationEventsSpy: jest.SpyInstance;
  beforeEach(() => {
    listAuthorizationEventsSpy = auth.listAuthorizationEvents();
    mockUseCurrentProject();
    jest.useFakeTimers();
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
        <Route path="/audit/auth/:id" element={<AuthAuditDetail />} />
      </Routes>,
      {},
      {
        routerProps: {
          initialEntries: ['/audit/auth/123']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listAuthorizationEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_event_uid: '123',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
    expect(container).toMatchSnapshot();

    await screen.findByText('授权详情');
    await act(async () => jest.advanceTimersByTime(200));
    expect(container).toMatchSnapshot();
  });
  it('should back when user click back button', async () => {
    superRender(<AuthAuditDetail />);
    const backFn = jest.spyOn(window.history, 'back');

    fireEvent.click(screen.getByText('返 回'));
    expect(backFn).toBeCalledTimes(1);
  });
});
