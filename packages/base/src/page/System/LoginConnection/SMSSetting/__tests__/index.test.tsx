import system from '../../../../../testUtils/mockApi/system';
import { mockSMSConfigurationData } from '../../../../../testUtils/mockApi/system/data';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import SMSSetting from '..';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/shared/lib/enum';

describe('base/System/GlobalSetting/SMSSetting', () => {
  let getSmsConfigurationSpy: jest.SpyInstance;
  let updateSmsConfigurationSpy: jest.SpyInstance;
  let testSmsConfigurationSpy: jest.SpyInstance;

  const customRender = () => {
    return superRender(<SMSSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    getSmsConfigurationSpy = system.getSmsConfiguration();
    updateSmsConfigurationSpy = system.updateSmsConfiguration();
    testSmsConfigurationSpy = system.testSmsConfiguration();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    await act(async () => jest.advanceTimersByTime(2600));
    expect(getSmsConfigurationSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#enabled')).toBeChecked();
  });

  it('render snap when user is not admin or global manager', async () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false,
        [SystemRole.certainProjectManager]: true,
        [SystemRole.globalViewing]: true,
        [SystemRole.createProject]: true
      }
    });
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(mockSMSConfigurationData.url)).toBeInTheDocument();
  });

  it('render close sms configuration', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    fireEvent.click(getBySelector('#enabled'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();

    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSmsConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateSmsConfigurationSpy).toHaveBeenCalledWith({
      update_sms_configuration: {
        enable_sms: false
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSmsConfigurationSpy).toHaveBeenCalledTimes(2);
  });

  it('render edit sms configuration', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.modify-coding-configuration')).toBeVisible();
    fireEvent.click(getBySelector('.modify-coding-configuration'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#url')).toBeVisible();
    expect(getBySelector('#token')).toBeVisible();
    const mockFormData = {
      url: 'test url',
      token: '123456'
    };
    fireEvent.change(getBySelector('#url'), {
      target: {
        value: mockFormData.url
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#token'), {
      target: { value: mockFormData.token }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSmsConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateSmsConfigurationSpy).toHaveBeenCalledWith({
      update_sms_configuration: {
        enable_sms: true,
        url: mockFormData.url,
        configuration: { token: mockFormData.token }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSmsConfigurationSpy).toHaveBeenCalledTimes(2);
  });

  it('render test sms connection', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.system-config-button')).toBeVisible();
    fireEvent.click(getBySelector('.system-config-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#phone')).toBeInTheDocument();

    fireEvent.change(getBySelector('#phone'), {
      target: {
        value: '12345678999'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('正在测试短信服务...')).toBeInTheDocument();
    expect(testSmsConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(testSmsConfigurationSpy).toHaveBeenCalledWith({
      test_sms_configuration: {
        recipient_phone: '12345678999'
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('当前短信服务验证通过')).toBeInTheDocument();
  });

  it('render test sms connection when request return error message', async () => {
    testSmsConfigurationSpy.mockClear();
    testSmsConfigurationSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          send_error_message: '链接失败',
          is_smtp_send_normal: false
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.system-config-button')).toBeVisible();
    fireEvent.click(getBySelector('.system-config-button'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#phone')).toBeInTheDocument();

    fireEvent.change(getBySelector('#phone'), {
      target: {
        value: '12345678999'
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('正在测试短信服务...')).toBeInTheDocument();
    expect(testSmsConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(testSmsConfigurationSpy).toHaveBeenCalledWith({
      test_sms_configuration: {
        recipient_phone: '12345678999'
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('链接失败')).toBeInTheDocument();
  });

  it('render open sms configuration', async () => {
    getSmsConfigurationSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          enable: false,
          url: '',
          sms_type: '',
          configuration: {
            token: ''
          }
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = getBySelector('#enabled');
    expect(switchEle).not.toBeChecked();

    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));
    const mockFormData = {
      url: 'test url',
      token: '123456'
    };
    fireEvent.change(getBySelector('#url'), {
      target: {
        value: mockFormData.url
      }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.change(getBySelector('#token'), {
      target: { value: mockFormData.token }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(switchEle);
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(
        '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateSmsConfigurationSpy).toHaveBeenCalledTimes(1);
    expect(updateSmsConfigurationSpy).toHaveBeenCalledWith({
      update_sms_configuration: {
        enable_sms: true,
        url: mockFormData.url,
        configuration: { token: mockFormData.token }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSmsConfigurationSpy).toHaveBeenCalledTimes(2);
  });
});
