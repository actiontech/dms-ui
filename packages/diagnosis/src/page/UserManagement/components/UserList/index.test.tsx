import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import UserList from './';
import user from '../../../../testUtils/mockApi/user';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useDispatch, useSelector } from 'react-redux';
import { superRender } from '../../../../testUtils/customRender';
import { ModalName } from '../../../../data/ModalName';
import { userListData } from '../../../../testUtils/mockApi/user/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('test user table', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        userManagement: {
          modalStatus: {}
        }
      });
    });
    user.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render table when api return null', async () => {
    const request = user.getUserList();
    request.mockImplementation(() => createSpySuccessResponse([]));
    const { baseElement } = superRender(<UserList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should render normal table', async () => {
    const request = user.getUserList();
    const { baseElement } = superRender(<UserList />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
    expect(screen.getAllByText('admin')?.[0]).toBeInTheDocument();
    expect(screen.queryAllByText('编 辑').length).toBe(1);
  });

  it('should open model when click edit button', async () => {
    const request = user.getUserList();
    const { baseElement } = superRender(<UserList />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getAllByText('编 辑').length).toBe(1);

    mockDispatch.mockClear();
    fireEvent.click(screen.getAllByText('编 辑')[0]);
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: userListData[0],
      type: 'userManagement/updateSelectUserData'
    });
    expect(mockDispatch).toBeCalledTimes(2);
    expect(mockDispatch).toBeCalledWith({
      payload: {
        modalName: ModalName.Update_Server_Monitor,
        status: true
      },
      type: 'userManagement/updateModalStatus'
    });
  });

  it('should open query popover when click delete button', async () => {
    const request = user.getUserList();
    const deleteRequest = user.deleteUser();
    const { baseElement } = superRender(<UserList />);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(request).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('删 除')[0]);
    expect(screen.getByText('确认删除用户test?')).toBeInTheDocument();
    expect(screen.getAllByText('确 认')[0]).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('确 认')[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('正在删除用户test...')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(deleteRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('删除用户test成功！')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
  });

  it('should refresh table when change pagination info', async () => {
    const request = user.getUserList();
    const { baseElement } = superRender(<UserList />);
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
    expect(screen.getByText('共 1 条数据')).toBeInTheDocument();
  });
});
