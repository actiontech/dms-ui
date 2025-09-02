import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import UserEmail from '../UserEmail';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import account from '../../../../testUtils/mockApi/account';

describe.skip('test base/page/Account/UserEmail', () => {
  const updateUserInfoSpy = jest.fn();
  const messageSuccessSpy = jest.fn();
  const messageErrorSpy = jest.fn();

  const customRender = (email?: string) => {
    return renderWithTheme(
      <UserEmail
        messageApi={{
          success: messageSuccessSpy,
          error: messageErrorSpy,
          info: jest.fn(),
          warning: jest.fn(),
          loading: jest.fn(),
          open: jest.fn(),
          destroy: jest.fn()
        }}
        updateUserInfo={updateUserInfoSpy}
        userBaseInfo={{ email }}
      />
    );
  };
  let updateCurrentUserSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    updateCurrentUserSpy = account.updateCurrentUser();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should match snapshot', () => {
    const { container } = customRender('test@gmail.com');
    expect(container).toMatchSnapshot();
  });

  it('execute the onSubmit after triggering the enter event', async () => {
    const { container } = customRender('test@gmail.com');

    fireEvent.mouseEnter(
      getBySelector('.ant-row,.ant-row-space-between.ant-row-middle', container)
    );

    fireEvent.click(getBySelector('.config-item-filed-edit-button', container));

    const inputEle = getBySelector('input.ant-input#editInput', container);

    fireEvent.change(inputEle, {
      target: {
        value: 'submit.com'
      }
    });
    fireEvent.keyDown(inputEle, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    expect(messageErrorSpy).toHaveBeenCalledTimes(1);
    expect(messageErrorSpy).toHaveBeenCalledWith('请输入正确格式的邮箱地址');

    fireEvent.change(inputEle, {
      target: {
        value: 'test@gmail.com'
      }
    });
    fireEvent.keyDown(inputEle, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    expect(messageErrorSpy).toHaveBeenCalledTimes(2);
    expect(messageErrorSpy).toHaveBeenCalledWith('新邮箱地址不能与旧地址一致');
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(0);

    fireEvent.change(inputEle, {
      target: {
        value: 'submit@gmail.com'
      }
    });
    fireEvent.keyDown(inputEle, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });

    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);
    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: {
        email: 'submit@gmail.com'
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(messageSuccessSpy).toHaveBeenCalledTimes(1);
    expect(messageSuccessSpy).toHaveBeenCalledWith('邮箱地址更新成功');
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();
  });
});
