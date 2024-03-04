import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import UserWechat from '../UserWechat';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import account from '../../../../testUtils/mockApi/account';

describe('test base/page/Account/UserWechat', () => {
  const updateUserInfoSpy = jest.fn();
  const messageSuccessSpy = jest.fn();

  const customRender = (wxid?: string) => {
    return renderWithTheme(
      <UserWechat
        messageApi={{ success: messageSuccessSpy } as any}
        updateUserInfo={updateUserInfoSpy}
        userBaseInfo={{ wxid }}
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
    const { container } = customRender('test_id');
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
        value: 'test_id'
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
        wxid: 'test_id'
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(messageSuccessSpy).toHaveBeenCalledTimes(1);
    expect(messageSuccessSpy).toHaveBeenCalledWith('微信号更新成功');
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);

    expect(container).toMatchSnapshot();
  });
});
