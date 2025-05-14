import ConfigExtraButtons, {
  ConfigExtraButtonsProps
} from './ConfigExtraButtons';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import system from '../../../../../testUtils/mockApi/system';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/ProcessConnection/WechatAuditSetting/ConfigExtraButtons', () => {
  let requestTestWechatAuditConfig: jest.SpyInstance;
  const handleClickModifyFn = jest.fn();
  const customRender = (
    params: Omit<ConfigExtraButtonsProps, 'handleClickModify'>
  ) => {
    return superRender(
      <ConfigExtraButtons {...params} handleClickModify={handleClickModifyFn} />
    );
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestTestWechatAuditConfig = system.testWechatAuditConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  describe('render snap when hidden val is true', () => {
    it('render isConfigClosed is true', () => {
      const { baseElement } = customRender({
        isConfigClosed: true,
        extraButtonsVisible: true,
        enabled: false
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render extraButtonsVisible is false', () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: false,
        enabled: true
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render enabled is false', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: false
      });

      const systemIconBtn = getAllBySelector(
        '.system-config-button',
        baseElement
      );
      fireEvent.click(systemIconBtn[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
  });

  describe('render snap form', () => {
    it('render popover cancel btn', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      const btnPopoverOpen = getAllBySelector(
        '.system-config-button',
        baseElement
      )[0];
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#wechatUserID', baseElement), {
        target: {
          value: '12345'
        }
      });

      expect(getBySelector('#wechatUserID', baseElement)).toHaveAttribute(
        'value',
        '12345'
      );

      expect(screen.getByText('取 消')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.getByText('取 消'));

      fireEvent.click(btnPopoverOpen);
      expect(getBySelector('#wechatUserID', baseElement)).toHaveAttribute(
        'value',
        ''
      );
    });

    it('render form submit success', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      await act(async () => jest.advanceTimersByTime(3300));
      const btnPopoverOpen = getAllBySelector(
        '.system-config-button',
        baseElement
      )[0];
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#wechatUserID', baseElement), {
        target: {
          value: '12345'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(
        screen.getByText('正在向企业微信用户推送消息...')
      ).toBeInTheDocument();

      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestTestWechatAuditConfig).toHaveBeenCalledTimes(1);
      expect(requestTestWechatAuditConfig).toHaveBeenCalledWith({
        wechat_id: '12345'
      });

      await act(async () => jest.advanceTimersByTime(400));
      expect(
        screen.getByText('已成功将消息推送至指定账号')
      ).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render submit btn when api error', async () => {
      requestTestWechatAuditConfig.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            is_message_sent_normally: false,
            error_message: 'error info'
          }
        })
      );
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      await act(async () => jest.advanceTimersByTime(3300));
      const btnPopoverOpen = getAllBySelector(
        '.system-config-button',
        baseElement
      )[0];
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#wechatUserID', baseElement), {
        target: {
          value: '12345'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(
        screen.getByText('正在向企业微信用户推送消息...')
      ).toBeInTheDocument();

      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestTestWechatAuditConfig).toHaveBeenCalledTimes(1);
      expect(requestTestWechatAuditConfig).toHaveBeenCalledWith({
        wechat_id: '12345'
      });

      await act(async () => jest.advanceTimersByTime(400));

      expect(
        screen.queryByText('已成功将消息推送至指定账号')
      ).not.toBeInTheDocument();

      expect(screen.queryByText('error info')).toBeInTheDocument();
    });
  });
});
