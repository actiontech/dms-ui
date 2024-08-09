import {
  render,
  fireEvent,
  screen,
  act,
  cleanup
} from '@testing-library/react';
import useDbService from '.';
import { Select } from 'antd';
import dbServices from '../../testUtils/mockApi/dbServices';
import { dbServicesTips } from '../../testUtils/mockApi/dbServices/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';

const projectID = '7200';

describe('useDbService', () => {
  let listDbServicesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    listDbServicesSpy = dbServices.ListDBServicesTips();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get dbService data from request', async () => {
    const { result } = renderHooksWithRedux(() => useDbService(), {});
    expect(result.current.loading).toBeFalsy();
    expect(result.current.dbServiceList).toEqual([]);
    act(() =>
      result.current.updateDbServiceList({
        project_uid: projectID,
        functional_module:
          ListDBServiceTipsFunctionalModuleEnum.create_export_task
      })
    );
    expect(listDbServicesSpy).toHaveBeenCalled();
    expect(listDbServicesSpy).toHaveBeenCalledWith({
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task,
      project_uid: projectID
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.dbServiceList).toEqual(dbServicesTips);
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listDbServicesSpy.mockClear();
    listDbServicesSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHooksWithRedux(() => useDbService(), {});
    act(() => {
      result.current.updateDbServiceList({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbServiceList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    listDbServicesSpy.mockClear();
    listDbServicesSpy.mockImplementation(() =>
      createSpyErrorResponse({ total: 0, users: [] })
    );
    const { result } = renderHooksWithRedux(() => useDbService(), {});
    act(() => {
      result.current.updateDbServiceList({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbServiceList).toEqual([]);
  });

  it('should render options when use generateDbServiceIDSelectOptions', async () => {
    const { result } = renderHooksWithRedux(() => useDbService(), {});

    act(() => {
      result.current.updateDbServiceList({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="123123">
        {result.current.generateDbServiceIDSelectOptions()}
      </Select>
    );

    expect(result.current.dbServiceIDOptions).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('test (127.0.0.1:3306)'));
      jest.runAllTimers();
    });

    await screen.findAllByText('test (127.0.0.1:3306)');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  it('should render options when use generateDbServiceSelectOptions', async () => {
    const { result } = renderHooksWithRedux(() => useDbService(), {});

    act(() => {
      result.current.updateDbServiceList({ project_uid: projectID });
    });
    await act(async () => jest.advanceTimersByTime(3000));

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="123123">
        {result.current.generateDbServiceSelectOptions()}
      </Select>
    );
    expect(result.current.dbServiceOptions).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElementWithOptions).toMatchSnapshot();

    await act(() => {
      fireEvent.mouseDown(screen.getByText('123123'));
      jest.runAllTimers();
    });

    await screen.findAllByText('123123');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
