import SMTPSetting from '.';
import system from '../../../../testUtils/mockApi/system';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/PushNotification/SMTPSetting', () => {
  let requestGetSMTPConfiguration: jest.SpyInstance;
  let requestUpdateSMTPConfiguration: jest.SpyInstance;
  const customRender = () => {
    return renderWithTheme(<SMTPSetting />);
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

      expect(screen.getByText('取 消')).toBeInTheDocument();
      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when click switch change', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('OK'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
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
