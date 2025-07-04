import LarkSetting from '.';

import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/PushNotification/LarkSetting', () => {
  let requestGetFeishuConfiguration: jest.SpyInstance;
  let requestUpdateFeishuConfiguration: jest.SpyInstance;
  const customRender = () => {
    return superRender(<LarkSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetFeishuConfiguration = system.getLarkConfig();
    requestUpdateFeishuConfiguration = system.updateLarkConfig();
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
    expect(requestGetFeishuConfiguration).toHaveBeenCalled();
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
      expect(screen.getByText('是否启用飞书推送')).toBeInTheDocument();

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      expect(screen.getAllByText('取 消')[1]).toBeInTheDocument();
      fireEvent.click(screen.getAllByText('取 消')[1]);
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
      expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
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

      fireEvent.change(getBySelector('#appKey', baseElement), {
        target: {
          value: 'app key'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#appSecret', baseElement), {
        target: {
          value: 'app secret'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateFeishuConfiguration).toHaveBeenCalled();
      expect(requestUpdateFeishuConfiguration).toHaveBeenCalledWith({
        update_feishu_configuration: {
          app_id: 'app key',
          app_secret: 'app secret',
          is_feishu_notification_enabled: true
        }
      });
      expect(requestGetFeishuConfiguration).toHaveBeenCalled();
    });
  });
});
