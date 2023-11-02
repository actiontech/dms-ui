import dayjs from 'dayjs';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AuthAudit from '.';
import { superRender } from '../../../testUtil/customRender';
import { authAuditList } from '../../../testUtil/mockApi/auth/data';
import { getBySelector, queryBySelector } from '../../../testUtil/customQuery';
import LocationDisplay, {
  LocationSearchDisplayTestId
} from '~/testUtil/LocationDisplay';
import auth from '~/testUtil/mockApi/auth';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('Audit/AuthAudit', () => {
  let listAuthorizationEventsSpy: jest.SpyInstance;
  beforeEach(() => {
    listAuthorizationEventsSpy = auth.listAuthorizationEvents();
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
    const { container } = superRender(<AuthAudit />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('temp-1');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    listAuthorizationEventsSpy.mockClear();
    listAuthorizationEventsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        instances: authAuditList.slice(-2)
      })
    );

    const { container } = superRender(<AuthAudit />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listAuthorizationEventsSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refresh'));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listAuthorizationEventsSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when using the filtering function', async () => {
    const currentDay = dayjs().format('YYYY-MM-DD');

    superRender(
      <>
        <AuthAudit />
        <LocationDisplay />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('使用人'), {
      target: { value: 'user-1' }
    });
    fireEvent.input(screen.getByLabelText('目的或用途'), {
      target: { value: 'purpose-1' }
    });
    fireEvent.input(screen.getByLabelText('权限模板'), {
      target: { value: 'temp-1' }
    });
    fireEvent.input(screen.getByLabelText('操作用户'), {
      target: { value: 'admin' }
    });
    selectOptionByIndex('操作类型', '创建授权', 1);
    fireEvent.click(getBySelector('.ant-picker-range'));
    await act(() => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('00')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('确 定'));
    await act(() => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getAllByText('01')[0]);
    fireEvent.click(screen.getAllByText('00')[1]);
    fireEvent.click(screen.getByText('确 定'));
    await act(() => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('搜 索'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(listAuthorizationEventsSpy).toBeCalledTimes(2);
    expect(listAuthorizationEventsSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      filter_by_create_user: 'admin',
      filter_by_data_permission_template_name: 'temp-1',
      filter_by_event_type: 'auth_created',
      filter_by_permission_user: 'user-1',
      filter_by_purpose: 'purpose-1',
      filter_by_generated_time_end: `${currentDay}T01:00:00+08:00`,
      filter_by_generated_time_start: `${currentDay}T00:00:00+08:00`,
      filter_by_namespace_uid: mockProjectInfo.projectID
    });

    expect(screen.getByTestId(LocationSearchDisplayTestId).innerHTML).toEqual(
      `?filter_by_permission_user=user-1&amp;filter_by_purpose=purpose-1&amp;filter_by_data_permission_template_name=temp-1&amp;filter_by_create_user=admin&amp;filter_by_event_type=auth_created&amp;filter_by_generated_time_start=${currentDay}T00%3A00%3A00%2B08%3A00&amp;filter_by_generated_time_end=${currentDay}T01%3A00%3A00%2B08%3A00`
    );
  });

  it('should filtered data when location.search is exist', async () => {
    superRender(
      <AuthAudit />,
      {},
      {
        routerProps: {
          initialEntries: [
            '/audit/auth?filter_by_permission_user=admin&filter_by_purpose=purpose-1&filter_by_data_permission_template_name=temp-1&filter_by_create_user=root&filter_by_event_type=auth_created&filter_by_generated_time_start=2023-01-13T00%3A37%3A00%2B08%3A00&filter_by_generated_time_end=2023-01-14T17%3A41%3A00%2B08%3A00'
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listAuthorizationEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_create_user: 'root',
      filter_by_data_permission_template_name: 'temp-1',
      filter_by_event_type: 'auth_created',
      filter_by_generated_time_start: '2023-01-13T00:37:00+08:00',
      filter_by_generated_time_end: '2023-01-14T17:41:00+08:00',
      filter_by_permission_user: 'admin',
      filter_by_purpose: 'purpose-1',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
  });
});
