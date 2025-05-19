import UpdatePassword from '../UpdatePassword';
import { useDispatch } from 'react-redux';
import account from '@actiontech/shared/lib/testUtil/mockApi/base/account';
import { act, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../testUtils/superRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/Account/UpdatePassword', () => {
  const onCloseSpy = jest.fn();
  const customRender = () => {
    return baseSuperRender(<UpdatePassword open onClose={onCloseSpy} />);
  };

  const scopeDispatch = jest.fn();
  let updateCurrentUserSpy: jest.SpyInstance;

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    updateCurrentUserSpy = account.updateCurrentUser();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it('should match snapshot', () => {
    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();
  });

  it('fill in the form and submit and close', async () => {
    customRender();

    fireEvent.change(screen.getByLabelText('旧密码'), {
      target: { value: 'admin' }
    });

    fireEvent.change(screen.getByLabelText('新密码'), {
      target: { value: 'admin1' }
    });

    fireEvent.change(screen.getByLabelText('确认新密码'), {
      target: { value: 'admin12' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.change(screen.getByLabelText('确认新密码'), {
      target: { value: 'admin1' }
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);
    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: { old_password: 'admin', password: 'admin1' }
    });

    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').closest('button')).toBeDisabled();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(scopeDispatch).toHaveBeenCalledTimes(1);
    expect(scopeDispatch).toHaveBeenCalledWith({
      payload: {
        token: ''
      },
      type: 'user/updateToken'
    });

    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').closest('button')).not.toBeDisabled();

    expect(screen.getByLabelText('旧密码')).toHaveValue('admin');

    fireEvent.click(screen.getByText('关 闭'));
    expect(screen.getByLabelText('旧密码')).toHaveValue('');
    expect(screen.getByLabelText('新密码')).toHaveValue('');
    expect(screen.getByLabelText('确认新密码')).toHaveValue('');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });
});
