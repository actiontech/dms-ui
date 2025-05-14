import UserPhone from '../UserPhone';
import { act, fireEvent } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import account from '../../../../testUtils/mockApi/account';
import { superRender } from '../../../../testUtils/customRender';

describe('test base/page/Account/UserPhone', () => {
  const updateUserInfoSpy = jest.fn();
  const messageSuccessSpy = jest.fn();
  const messageErrorSpy = jest.fn();

  const customRender = (phone?: string) => {
    return superRender(
      <UserPhone
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
        userBaseInfo={{ phone }}
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
    const { container } = customRender('13112134353');
    expect(container).toMatchSnapshot();
  });

  it('execute the onSubmit after triggering the enter event', async () => {
    const { container } = customRender('13112134353');

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
    expect(messageErrorSpy).toHaveBeenCalledWith('请输入正确格式的手机号码');

    fireEvent.change(inputEle, {
      target: {
        value: '13112134353'
      }
    });
    fireEvent.keyDown(inputEle, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    expect(messageErrorSpy).toHaveBeenCalledTimes(2);
    expect(messageErrorSpy).toHaveBeenCalledWith('新手机号码不能与旧号码一致');
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(0);

    fireEvent.change(inputEle, {
      target: {
        value: '13214334343'
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
        phone: '13214334343'
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(messageSuccessSpy).toHaveBeenCalledTimes(1);
    expect(messageSuccessSpy).toHaveBeenCalledWith('手机号更新成功');
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();
  });
});
