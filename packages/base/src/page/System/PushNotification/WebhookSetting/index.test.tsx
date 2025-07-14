import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { DEFAULT_CONSTANT } from './index.data';
import WebHook from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/PushNotification/WebhookSetting', () => {
  let requestGetWebHookConfiguration: jest.SpyInstance;
  let requestUpdateWebHookConfiguration: jest.SpyInstance;

  const customRender = () => {
    return superRender(<WebHook />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetWebHookConfiguration = system.getWebhookConfig();
    requestUpdateWebHookConfiguration = system.updateWebhookConfig();
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
    expect(requestGetWebHookConfiguration).toHaveBeenCalled();
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
      expect(screen.getByText('是否开启Webhook通知')).toBeInTheDocument();

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
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

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeInTheDocument();
      expect(screen.getAllByText('取 消')[0]).toBeInTheDocument();
      expect(screen.getByText('确 认')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('取 消')[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render submit lark setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#url', baseElement), {
        target: {
          value: 'http://a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#maxRetryTimes', baseElement), {
        target: {
          value: '1'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#retryIntervalSeconds', baseElement), {
        target: {
          value: '2'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(requestUpdateWebHookConfiguration).toHaveBeenCalled();
      expect(requestUpdateWebHookConfiguration).toHaveBeenCalledWith({
        webhook_config: {
          enable: true,
          max_retry_times: 1,
          retry_interval_seconds: 2,
          token: undefined,
          url: 'http://a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(requestGetWebHookConfiguration).toHaveBeenCalled();
    });

    it('render submit success when no input val', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#url', baseElement), {
        target: {
          value: 'http://b.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(requestUpdateWebHookConfiguration).toHaveBeenCalled();
      expect(requestUpdateWebHookConfiguration).toHaveBeenCalledWith({
        webhook_config: {
          enable: true,
          max_retry_times: DEFAULT_CONSTANT.maxRetryTimes,
          retry_interval_seconds: DEFAULT_CONSTANT.retryIntervalSeconds,
          token: undefined,
          url: 'http://b.com'
        }
      });
    });
  });
});
