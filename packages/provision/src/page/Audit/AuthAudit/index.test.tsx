import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import auth from '../../../testUtil/mockApi/auth';
import { authAuditList } from '../../../testUtil/mockApi/auth/data';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import AuthAudit from '.';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector, getAllBySelector } from '../../../testUtil/customQuery';

describe('page/auth/AuthAudit', () => {
  const projectID = mockProjectInfo.projectID;
  const customRender = () => {
    return superRender(<AuthAudit />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    auth.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const userListSpy = auth.listUsers();
    const requestListSpy = auth.listAuthorizationEvents();
    requestListSpy.mockImplementation(() => {
      return createSpySuccessResponse({ total_nums: 0, data: [] });
    });
    const { baseElement } = customRender();
    expect(screen.getByText('授权审计')).toBeInTheDocument();
    expect(screen.getByText('筛选')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userListSpy).toHaveBeenCalledTimes(1);
    expect(requestListSpy).toHaveBeenCalledTimes(1);
    expect(requestListSpy).toHaveBeenCalledWith({
      filter_by_namespace_uid: projectID,
      keyword: '',
      page_index: 1,
      page_size: 20
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    expect(requestListSpy).toHaveBeenCalledTimes(2);
  });

  it('render table list when api return data', async () => {
    const requestListSpy = auth.listAuthorizationEvents();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(`共 ${authAuditList.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when api return error', async () => {
    const requestListSpy = auth.listAuthorizationEvents();
    requestListSpy.mockImplementationOnce(() =>
      createSpyErrorResponse({ message: 'this is a error info' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('授权审计')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render action when click detail drawer', async () => {
    const singleData = authAuditList[1];
    const requestListSpy = auth.listAuthorizationEvents();
    requestListSpy.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [singleData]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('详 情')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('详 情'));
      await jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('授权详情')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`${singleData.permission_user_name}`)
    ).toBeInTheDocument();
  });

  it('render table list when action filter', async () => {
    const requestListSpy = auth.listAuthorizationEvents();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListSpy).toHaveBeenCalledTimes(1);
    const searchInputEle = getBySelector(
      '.basic-input-wrapper #actiontech-table-search-input',
      baseElement
    );
    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: '123' }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(searchInputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await act(() => jest.advanceTimersByTime(300));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListSpy).toHaveBeenCalled();
    expect(requestListSpy).toHaveBeenCalledWith({
      filter_by_namespace_uid: projectID,
      keyword: '123',
      page_index: 1,
      page_size: 20
    });
  });

  it('render action when filter item show', async () => {
    const requestListSpy = auth.listAuthorizationEvents();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(4);
    expect(baseElement).toMatchSnapshot();
  });
});
