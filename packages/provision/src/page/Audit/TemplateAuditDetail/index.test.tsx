import { act, cleanup, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { superRender } from '~/testUtil/customRender';
import auth from '~/testUtil/mockApi/auth';
import TemplateAuditDetail from '.';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('/audit/templateDetail', () => {
  let listDataPermissionTemplateEventsSpy: jest.SpyInstance;
  beforeEach(() => {
    listDataPermissionTemplateEventsSpy =
      auth.listDataPermissionTemplateEvents();
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
        <Route path="/audit/template/:id" element={<TemplateAuditDetail />} />
      </Routes>,
      {},
      {
        routerProps: {
          initialEntries: ['/audit/template/123']
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataPermissionTemplateEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_event_uid: '123',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
    expect(container).toMatchSnapshot();

    await screen.findByText('模版详情');
    await act(async () => jest.advanceTimersByTime(300));
    expect(container).toMatchSnapshot();
  });
});
