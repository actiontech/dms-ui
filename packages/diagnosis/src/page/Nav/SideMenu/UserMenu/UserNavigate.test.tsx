import UserNavigate from '.';
import { diagnosisSuperRender } from '../../../../testUtils/superRender';
import { SupportTheme } from '@actiontech/shared/lib/enum';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('diagnosis/UserNavigate', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  const customRender = () => {
    return diagnosisSuperRender(
      <UserNavigate
        username="admin"
        theme={SupportTheme.LIGHT}
        updateTheme={jest.fn()}
      />
    );
  };
  it('should match snapshot', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('show user popover when click user avatar', async () => {
    const { baseElement } = customRender();
    fireEvent.click(getBySelector('.action-avatar'));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('退出登录')).toBeInTheDocument();
    fireEvent.click(getBySelector('.content-item'));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        username: '',
        userId: null,
        roleId: null
      },
      type: 'user/updateUser'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        userScope: []
      },
      type: 'user/updateUserScope'
    });
  });
});
