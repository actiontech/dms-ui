import SMTPSetting from '.';
import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SMTPConfig } from '@actiontech/shared/lib/testUtil/mockApi/base/system/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi/common';

describe('base/System/PushNotification/SMTPSetting', () => {
  let requestGetSMTPConfiguration: jest.SpyInstance;
  let requestUpdateSMTPConfiguration: jest.SpyInstance;
  const customRender = () => {
    return superRender(<SMTPSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetSMTPConfiguration = system.getSMTPConfig();
    requestUpdateSMTPConfiguration = system.updateSMTPConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(requestGetSMTPConfiguration).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when user is not admin', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  describe('render switch cancel btn', () => {
    it('render snap when click cont cancel btn', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('启用邮件推送')).toBeInTheDocument();

      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      expect(switchEle.length).toBe(2);
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      expect(screen.getAllByText('取 消')[1]).toBeInTheDocument();
      fireEvent.click(screen.getAllByText('取 消')[1]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('disable SMTP configuration', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
      expect(screen.getAllByText('取 消')[0]).toBeInTheDocument();
      expect(screen.getByText('确 认')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('取 消')[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
      expect(requestUpdateSMTPConfiguration).toHaveBeenCalled();
      expect(requestUpdateSMTPConfiguration).toHaveBeenCalledWith({
        smtp_configuration: {
          ...SMTPConfig,
          enable_smtp_notify: false
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSMTPConfiguration).toHaveBeenCalledTimes(2);
    });

    it('change SMTP configuration when enable is false', async () => {
      requestGetSMTPConfiguration.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            ...SMTPConfig,
            enable_smtp_notify: false
          }
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(getBySelector('#enable', baseElement));
      await act(async () => jest.advanceTimersByTime(0));
      fireEvent.click(getBySelector('#enable', baseElement));
      await act(async () => jest.advanceTimersByTime(100));

      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeVisible();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(100));
      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).not.toBeVisible();
    });
  });

  describe('render submit SMTP setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#host', baseElement), {
        target: {
          value: '10.10.10.1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#port', baseElement), {
        target: {
          value: '8080'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#username', baseElement), {
        target: {
          value: '1@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#password', baseElement), {
        target: {
          value: '123'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#passwordConfirm', baseElement), {
        target: {
          value: '123'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateSMTPConfiguration).toHaveBeenCalled();
      expect(requestUpdateSMTPConfiguration).toHaveBeenCalledWith({
        smtp_configuration: {
          enable_smtp_notify: true,
          is_skip_verify: undefined,
          smtp_host: '10.10.10.1',
          smtp_password: '123',
          smtp_port: '8080',
          smtp_username: '1@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSMTPConfiguration).toHaveBeenCalled();
    });
  });
});
