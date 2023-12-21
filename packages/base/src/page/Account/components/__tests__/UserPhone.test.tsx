import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import UserPhone from '../UserPhone';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import account from '../../../../testUtils/mockApi/account';

describe('test base/page/Account/UserPhone', () => {
  const updateUserInfoSpy = jest.fn();
  const messageSuccessSpy = jest.fn();

  const customRender = (phone?: string) => {
    return renderWithTheme(
      <UserPhone
        messageApi={{ success: messageSuccessSpy } as any}
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
    const { container } = customRender();

    fireEvent.mouseEnter(
      getBySelector('.ant-row,.ant-row-space-between.ant-row-middle', container)
    );

    fireEvent.click(getBySelector('.config-item-filed-edit-button', container));

    const inputEle = getBySelector('input.ant-input#editInput', container);

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

    expect(updateCurrentUserSpy).toBeCalledTimes(1);
    expect(updateCurrentUserSpy).toBeCalledWith({
      current_user: {
        phone: '13214334343'
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(messageSuccessSpy).toBeCalledTimes(1);
    expect(messageSuccessSpy).toBeCalledWith('手机号更新成功');
    expect(updateCurrentUserSpy).toBeCalledTimes(1);

    expect(container).toMatchSnapshot();
  });
});
