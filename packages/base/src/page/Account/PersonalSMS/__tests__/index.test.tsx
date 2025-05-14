import sms from '../../../../testUtils/mockApi/sms';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import PersonalSMS from '..';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import account from '../../../../testUtils/mockApi/account';
import { baseSuperRender } from '../../../../testUtils/superRender';

describe('base/System/GlobalSetting/PersonalSMS', () => {
  let updateCurrentUserSpy: jest.SpyInstance;
  let sendSmsCodeSpy: jest.SpyInstance;
  let verifySmsCodeSpy: jest.SpyInstance;
  let getUserInfoSpy = jest.fn();
  const customRender = ({
    phone = mockUserInfo.userInfo.phone,
    enabled = true
  }) => {
    return baseSuperRender(
      <PersonalSMS
        userBaseInfo={{
          ...mockUserInfo.userInfo,
          two_factor_enabled: enabled,
          phone: phone
        }}
        getUserInfo={getUserInfoSpy}
        loading={false}
      />
    );
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    updateCurrentUserSpy = account.updateCurrentUser();
    sendSmsCodeSpy = sms.sendSmsCode();
    verifySmsCodeSpy = sms.verifySmsCode();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender({});
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#enabled')).toBeChecked();
  });

  it('render close personal sms', async () => {
    customRender({});
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(getBySelector('#enabled'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);
    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: {
        two_factor_enabled: false
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getUserInfoSpy).toHaveBeenCalledTimes(1);
  });

  it('render open personal sms', async () => {
    customRender({ enabled: false });
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = getBySelector('#enabled');
    expect(switchEle).not.toBeChecked();

    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('发送验证码'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sendSmsCodeSpy).toHaveBeenCalledTimes(1);

    fireEvent.change(getBySelector('#code'), {
      target: {
        value: '1234'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(verifySmsCodeSpy).toHaveBeenCalledTimes(1);
    expect(verifySmsCodeSpy).toHaveBeenNthCalledWith(1, {
      code: '1234',
      username: mockUserInfo.userInfo.name
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateCurrentUserSpy).toHaveBeenCalledTimes(1);
    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: {
        two_factor_enabled: true
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getUserInfoSpy).toHaveBeenCalledTimes(1);
  });

  it('render open personal sms when user phone is empty string', async () => {
    customRender({ enabled: false, phone: '' });
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = getBySelector('#enabled');
    expect(switchEle).not.toBeChecked();

    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      screen.getByText('请先完成手机号绑定后开启双因素认证')
    ).toBeInTheDocument();
  });

  it('render open personal sms when verify sms code fail', async () => {
    verifySmsCodeSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          is_verify_sent_normally: false,
          verify_error_message: '验证码错误'
        }
      })
    );
    customRender({ enabled: false });
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = getBySelector('#enabled');
    expect(switchEle).not.toBeChecked();

    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('发送验证码'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(sendSmsCodeSpy).toHaveBeenCalledTimes(1);

    fireEvent.change(getBySelector('#code'), {
      target: {
        value: '1234'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(verifySmsCodeSpy).toHaveBeenCalledTimes(1);
    expect(verifySmsCodeSpy).toHaveBeenNthCalledWith(1, {
      code: '1234',
      username: mockUserInfo.userInfo.name
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('验证码错误')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateCurrentUserSpy).not.toHaveBeenCalled();
  });
});
