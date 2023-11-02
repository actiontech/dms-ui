import { screen, act, cleanup, fireEvent } from '@testing-library/react';
import TemplateAudit from '.';
import { superRender } from '~/testUtil/customRender';
import { getBySelector, queryBySelector } from '~/testUtil/customQuery';
import LocationDisplay, {
  LocationSearchDisplayTestId
} from '~/testUtil/LocationDisplay';
import auth from '~/testUtil/mockApi/auth';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { templateAuditList } from '~/testUtil/mockApi/auth/data';
import dayjs from 'dayjs';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('Audit/TemplateAudit', () => {
  let listDataPermissionTemplateEventsSpy: jest.SpyInstance;
  beforeEach(() => {
    listDataPermissionTemplateEventsSpy =
      auth.listDataPermissionTemplateEvents();
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
    const { container } = superRender(<TemplateAudit />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('temp-1');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    listDataPermissionTemplateEventsSpy.mockClear();
    listDataPermissionTemplateEventsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        instances: templateAuditList.slice(-2)
      })
    );
    const { container } = superRender(<TemplateAudit />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataPermissionTemplateEventsSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refresh'));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listDataPermissionTemplateEventsSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when using the filtering function', async () => {
    const currentDay = dayjs().format('YYYY-MM-DD');

    superRender(
      <>
        <TemplateAudit />
        <LocationDisplay />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('模板名称'), {
      target: { value: 'temp-1' }
    });
    fireEvent.input(screen.getByLabelText('操作用户'), {
      target: { value: 'user-2' }
    });
    selectOptionByIndex('操作类型', '创建权限模版', 1);
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

    expect(listDataPermissionTemplateEventsSpy).toBeCalledTimes(2);
    expect(listDataPermissionTemplateEventsSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      filter_by_create_user: 'user-2',
      filter_by_data_permission_template_name: 'temp-1',
      filter_by_event_type: 'data_permission_template_created',
      filter_by_generated_time_end: `${currentDay}T01:00:00+08:00`,
      filter_by_generated_time_start: `${currentDay}T00:00:00+08:00`,
      filter_by_namespace_uid: mockProjectInfo.projectID
    });

    expect(screen.getByTestId(LocationSearchDisplayTestId).innerHTML).toEqual(
      `?filter_by_data_permission_template_name=temp-1&amp;filter_by_create_user=user-2&amp;filter_by_event_type=data_permission_template_created&amp;filter_by_generated_time_start=${currentDay}T00%3A00%3A00%2B08%3A00&amp;filter_by_generated_time_end=${currentDay}T01%3A00%3A00%2B08%3A00`
    );
  });

  it('should filtered data when location.search is exist', async () => {
    superRender(
      <TemplateAudit />,
      {},
      {
        routerProps: {
          initialEntries: [
            '/audit/template?filter_by_data_object_service_name=service-1&filter_by_data_permission_template_name=temp-1&filter_by_create_user=user-1&filter_by_event_type=data_permission_template_created&filter_by_generated_time_start=2023-01-12T00%3A00%3A00%2B08%3A00&filter_by_generated_time_end=2023-01-13T17%3A56%3A48%2B08%3A00'
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataPermissionTemplateEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_create_user: 'user-1',
      filter_by_data_permission_template_name: 'temp-1',
      filter_by_data_object_service_name: 'service-1',
      filter_by_event_type: 'data_permission_template_created',
      filter_by_generated_time_end: '2023-01-13T17:56:48+08:00',
      filter_by_generated_time_start: '2023-01-12T00:00:00+08:00',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
  });
});
