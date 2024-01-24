import Wechat from '.';

import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector, getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/System/PushNotification/Wechat', () => {
  let requestGetWeChatConfiguration: jest.SpyInstance;
  let requestUpdateWeChatConfiguration: jest.SpyInstance;
  const customRender = () => {
    return renderWithTheme(<Wechat />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetWeChatConfiguration = system.getWeChatConfig();
    requestUpdateWeChatConfiguration = system.updateWeChatConfig();
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
    expect(requestGetWeChatConfiguration).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render switch cancel btn', () => {
    it('render snap when click cont cancel btn', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('是否启用微信通知')).toBeInTheDocument();

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

      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));
      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeInTheDocument();
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
  })

  describe('render submit wechat setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getAllBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#corp_id', baseElement), {
        target: {
          value: 'corp id'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#agent_id', baseElement), {
        target: {
          value: '1234'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#corp_secret', baseElement), {
        target: {
          value: 'abcd'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestUpdateWeChatConfiguration).toBeCalled();
      expect(requestUpdateWeChatConfiguration).toBeCalledWith({
        update_wechat_configuration: {
          enable_wechat_notify: true,
          corp_id: 'corp id',
          corp_secret: 'abcd',
          agent_id: 1234,
          safe_enabled: false,
          proxy_ip: '1.1.1.1'
        }
      });

      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetWeChatConfiguration).toBeCalled();
    });
    
    
  })
});
