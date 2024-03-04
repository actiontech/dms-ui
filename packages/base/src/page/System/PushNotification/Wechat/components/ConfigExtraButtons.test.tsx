import ConfigExtraButtons, {
  typeConfigExtraButtons
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/System/PushNotification/Wechat/ConfigExtraButtons', () => {
  let requestTestWeChatConfiguration: jest.SpyInstance;
  const handleClickModifyFn = jest.fn();
  const customRender = (
    params: Omit<typeConfigExtraButtons, 'handleClickModify'>
  ) => {
    return renderWithTheme(
      <ConfigExtraButtons {...params} handleClickModify={handleClickModifyFn} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestTestWeChatConfiguration = system.testWeChatConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  describe('render snap when hidden val is true', () => {
    it('render isConfigClosed is true', () => {
      const { baseElement } = customRender({
        enabled: false,
        isConfigClosed: true,
        extraButtonsVisible: false
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render extraButtonsVisible is false', () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: false,
        enabled: false
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render snap when ui interaction', () => {
    it('render click edit btn', async () => {
      const { baseElement } = customRender({
        enabled: false,
        isConfigClosed: false,
        extraButtonsVisible: true
      });
      expect(baseElement).toMatchSnapshot();

      const iconBtn = getAllBySelector('.system-config-button', baseElement);
      expect(iconBtn.length).toBe(2);
      const editBtn = iconBtn[1];
      fireEvent.mouseOver(editBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('修改')).toBeInTheDocument();

      fireEvent.click(editBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(handleClickModifyFn).toHaveBeenCalledTimes(1);
    });

    it('render test btn snap when click test btn no show', async () => {
      const { baseElement } = customRender({
        enabled: false,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const iconBtn = getAllBySelector('.system-config-button', baseElement);

      const testBtn = iconBtn[0];
      fireEvent.mouseOver(testBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试')).toBeInTheDocument();

      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
    });

    it('render test btn snap when click cancel btn', async () => {
      const { baseElement } = customRender({
        enabled: true,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const [testBtn] = getAllBySelector('.system-config-button', baseElement);
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();

      expect(screen.getByText('取 消')).toBeInTheDocument();
      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
    });

    it('render test btn snap when validate item', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });
      const btnPopoverOpen = getBySelector(
        '.ant-btn[type="submit"]',
        baseElement
      );
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      expect(
        getBySelector('input[ placeholder="请输入接收者UserID"]', baseElement)
      ).toBeInTheDocument();

      fireEvent.change(getBySelector('#receiveId', baseElement), {
        target: {
          value: 'id val'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestWeChatConfiguration).toHaveBeenCalled();
      expect(requestTestWeChatConfiguration).toHaveBeenCalledWith({
        test_wechat_configuration: {
          recipient_id: 'id val'
        }
      });
    });
  });

  describe('render snap when send api', () => {
    it('render snap when send api success', async () => {
      const { baseElement } = customRender({
        enabled: true,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const [testBtn] = getAllBySelector('.system-config-button', baseElement);
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));

      const receiveIdVal = 'id val2';
      fireEvent.change(getBySelector('#receiveId', baseElement), {
        target: {
          value: receiveIdVal
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        screen.getByText(`正在向${receiveIdVal}发送测试消息...`)
      ).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(2700));
      expect(requestTestWeChatConfiguration).toHaveBeenCalledTimes(1);
      expect(requestTestWeChatConfiguration).toHaveBeenCalledWith({
        test_wechat_configuration: {
          recipient_id: receiveIdVal
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试消息发送成功')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when send api error', async () => {
      requestTestWeChatConfiguration.mockImplementation(() =>
        createSpySuccessResponse({})
      );
      const { baseElement } = customRender({
        enabled: true,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const [testBtn] = getAllBySelector('.system-config-button', baseElement);
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));

      const receiveIdVal = 'id val2';
      fireEvent.change(getBySelector('#receiveId', baseElement), {
        target: {
          value: receiveIdVal
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        screen.getByText(`正在向${receiveIdVal}发送测试消息...`)
      ).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(2700));
      expect(requestTestWeChatConfiguration).toHaveBeenCalledTimes(1);
      expect(requestTestWeChatConfiguration).toHaveBeenCalledWith({
        test_wechat_configuration: {
          recipient_id: receiveIdVal
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('未知错误...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(300));
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));
    });
  });
});
