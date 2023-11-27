import {
  render,
  fireEvent,
  screen,
  act,
  renderHook,
  cleanup
} from '@testing-library/react';
import useDbService from '.';
import { Select } from 'antd';
import dbServices from '../../testUtils/mockApi/dbServices';
import { dbServices as dbServicesList } from '../../testUtils/mockApi/dbServices/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';

const projectID = '7200';

describe('useDbService', () => {
  let listDbServicesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    listDbServicesSpy = dbServices.ListDBServices();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should get dbService data from request', async () => {
    const { result } = renderHooksWithRedux(
      () => useDbService(),
      {}
    );
    expect(result.current.loading).toBeFalsy();
    expect(result.current.dbServiceList).toEqual([]);
    act(() => result.current.updateDbServiceList(projectID));
    expect(listDbServicesSpy).toBeCalled();
    expect(listDbServicesSpy).toBeCalledWith({
      page_size: 9999,
      project_uid: projectID
    });
    expect(result.current.loading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.loading).toBeFalsy();
    expect(result.current.dbServiceList).toEqual(dbServicesList);
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    listDbServicesSpy.mockClear();
    listDbServicesSpy.mockImplementation(() =>
      createSpyFailResponse({ total: 0, users: [] })
    );
    const { result } = renderHooksWithRedux(() => useDbService(), {});
    act(() => {
      result.current.updateDbServiceList(projectID);
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
      result.current.updateDbServiceList(projectID);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.dbServiceList).toEqual([]);
  });

  it('should render options when use generateRoleSelectOption', async () => {
    const { result } = renderHooksWithRedux(() => useDbService(),{});
    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="123123">
        {result.current.generateDbServiceIDSelectOptions()}
      </Select>
    );

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
