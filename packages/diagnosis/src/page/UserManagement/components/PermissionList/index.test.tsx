import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import userManagement from '../../../../testUtils/mockApi/userManagement';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import PermissionList from './';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { roleListData } from '../../../../testUtils/mockApi/userManagement/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('diagnosis/test user table', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    userManagement.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (id?: string) => {
    return superRender(<PermissionList />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {},
          permissionRoleId: id
        }
      }
    });
  };

  it('should render table when api return null', async () => {
    const request = userManagement.getScopeList();
    request.mockImplementation(() => createSpySuccessResponse({ data: [] }));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = userManagement.getScopeList();
    const filterRequest = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(filterRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
    expect(screen.getByText('操作权限名称')).toBeInTheDocument();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('权限')).toBeInTheDocument();
    expect(screen.getByText('筛选')).toBeInTheDocument();
  });

  it('show filter result when change filter type', async () => {
    const request = userManagement.getScopeList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('权限')).toBeInTheDocument();
    fireEvent.click(screen.getByText('权限'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
  });

  it('should render filter result when has default filter params', async () => {
    const request = userManagement.getScopeList();
    const filterRequest = userManagement.getRoleList();
    const { baseElement } = customRender('10000');
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(filterRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('收起筛选')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();

    fireEvent.mouseDown(
      getAllBySelector('.ant-select-selection-search-input')?.[0]
    );
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[1]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalled();
    expect(mockDispatch).toBeCalledWith({
      payload: roleListData?.[1].id,
      type: 'userManagement/updatePermissionRoleId'
    });
  });

  it('should clear filter when click filter button', async () => {
    const request = userManagement.getScopeList();
    const filterRequest = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(filterRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('筛选')).toBeInTheDocument();
    fireEvent.click(screen.getByText('筛选'));
    expect(screen.getByText('收起筛选')).toBeInTheDocument();
    expect(screen.getByText('角色名')).toBeInTheDocument();
    fireEvent.mouseDown(
      getAllBySelector('.ant-select-selection-search-input')?.[0]
    );
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getAllByText('admin')?.[0]).toBeInTheDocument();
    expect(request).toBeCalled();

    fireEvent.click(screen.getByText('收起筛选'));
    expect(request).toBeCalled();

    expect(mockDispatch).toBeCalled();
    expect(mockDispatch).toBeCalledWith({
      payload: undefined,
      type: 'userManagement/updatePermissionRoleId'
    });
  });

  it('render empty table when api return error', async () => {
    const request = userManagement.getScopeList();
    request.mockImplementation(() =>
      createSpySuccessResponse({ code: 300, message: 'error' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });
});
