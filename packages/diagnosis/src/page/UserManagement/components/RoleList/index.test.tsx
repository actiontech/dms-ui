import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import userManagement from '../../../../testUtils/mockApi/userManagement';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import { roleListData } from '../../../../testUtils/mockApi/userManagement/data';
import RoleList from './';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('diagnosis/test role table', () => {
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

  const customRender = () => {
    return superRender(<RoleList />, undefined, {
      initStore: {
        userManagement: {
          modalStatus: {}
        }
      }
    });
  };

  it('should render table when api return null', async () => {
    const request = userManagement.getRoleList();
    request.mockImplementation(() => createSpySuccessResponse({ data: [] }));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('admin')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(1);
    expect(screen.queryAllByText('删 除').length).toBe(1);
    expect(getBySelector('.anticon-ellipsis')).toBeInTheDocument();
    expect(getAllBySelector('.anticon-ellipsis').length).toBe(1);
    fireEvent.mouseOver(getBySelector('.anticon-ellipsis'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getBySelector('.ant-tooltip')).toBeInTheDocument();
    expect(screen.getByText('删除服务器')).toBeInTheDocument();
  });

  it('should open model when click edit button', async () => {
    const request = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getAllByText('编 辑').length).toBe(1);

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('编 辑')[0]);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: roleListData[1],
      type: 'userManagement/updateSelectRoleData'
    });
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Role,
        status: true
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should open query popover when click delete button', async () => {
    const request = userManagement.getRoleList();
    const deleteRequest = userManagement.deleteRole();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认要删除角色 "test"?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除角色 "test"...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('删除角色 "test" 成功')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
  });

  it('should refresh table when change pagination info', async () => {
    const request = userManagement.getRoleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search input'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('10 条/页')).toBeInTheDocument();
    fireEvent.click(screen.getByText('10 条/页'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    expect(screen.getByText('共 2 条数据')).toBeInTheDocument();
  });
});
