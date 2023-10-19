import { screen, act, cleanup, fireEvent } from '@testing-library/react';
import ServiceAudit from '.';
import { superRender } from '../../../testUtil/customRender';
import { serviceAuditList } from '../../../testUtil/mockApi/auth/data';
import { getBySelector, queryBySelector } from '../../../testUtil/customQuery';
import LocationDisplay, {
  LocationSearchDisplayTestId
} from '~/testUtil/LocationDisplay';
import auth from '~/testUtil/mockApi/auth';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import dayjs from 'dayjs';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('Audit/ServiceAudit', () => {
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
    const { container } = superRender(<ServiceAudit />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await screen.findByText('service-1');
    expect(container).toMatchSnapshot();
  });

  it('should refresh table when user click refresh button', async () => {
    listDataObjectServiceEventsSpy.mockClear();
    listDataObjectServiceEventsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        instances: serviceAuditList.slice(-2)
      })
    );
    const { container } = superRender(<ServiceAudit />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataObjectServiceEventsSpy).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('refresh'));
    expect(getBySelector('.ant-spin-spinning')).toBeInTheDocument();
    expect(listDataObjectServiceEventsSpy).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(0));
    expect(queryBySelector('.ant-spin-spinning')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should refresh table when using the filtering function', async () => {
    const currentDay = dayjs().format('YYYY-MM-DD');
    listDataObjectServiceEventsSpy.mockClear();
    listDataObjectServiceEventsSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total: 20,
        instances: serviceAuditList.slice(-2)
      })
    );
    superRender(
      <>
        <ServiceAudit />
        <LocationDisplay />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('数据所在业务'), {
      target: { value: 'business-1' }
    });
    fireEvent.input(screen.getByLabelText('数据源'), {
      target: { value: 'service-1' }
    });
    fireEvent.input(screen.getByLabelText('语句'), {
      target: { value: 'select *' }
    });
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

    expect(listDataObjectServiceEventsSpy).toBeCalledTimes(2);
    expect(listDataObjectServiceEventsSpy).nthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      filter_by_business: 'business-1',
      filter_by_data_object_service_name: 'service-1',
      filter_by_operation: 'select *',
      filter_by_generated_time_end: `${currentDay}T01:00:00+08:00`,
      filter_by_generated_time_start: `${currentDay}T00:00:00+08:00`,
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
    expect(screen.getByTestId(LocationSearchDisplayTestId).innerHTML).toEqual(
      `?filter_by_business=business-1&amp;filter_by_data_object_service_name=service-1&amp;filter_by_operation=select+*&amp;filter_by_generated_time_start=${currentDay}T00%3A00%3A00%2B08%3A00&amp;filter_by_generated_time_end=${currentDay}T01%3A00%3A00%2B08%3A00`
    );
  });

  it('should filtered data when location.search is exist', async () => {
    superRender(
      <ServiceAudit />,
      {},
      {
        routerProps: {
          initialEntries: [
            '/audit/service?filter_by_business=bus-1&filter_by_data_object_service_name=service-1&filter_by_operation=select+*&filter_by_generated_time_start=2023-01-12T17%3A51%3A32%2B08%3A00&filter_by_generated_time_end=2023-01-13T17%3A51%3A34%2B08%3A00'
          ]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listDataObjectServiceEventsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 20,
      filter_by_business: 'bus-1',
      filter_by_data_object_service_name: 'service-1',
      filter_by_generated_time_end: '2023-01-13T17:51:34+08:00',
      filter_by_generated_time_start: '2023-01-12T17:51:32+08:00',
      filter_by_operation: 'select *',
      filter_by_namespace_uid: mockProjectInfo.projectID
    });
  });
});
