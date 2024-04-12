import ConfigExtraButtons, {
  ConfigExtraButtonsProps
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { TestFeishuConfigurationReqV1AccountTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('base/System/ProcessConnection/LarkAuditSetting/ConfigExtraButtons', () => {
  let requestTestFeishuAuditConfig: jest.SpyInstance;
  const handleClickModifyFn = jest.fn();
  const customRender = (
    params: Omit<ConfigExtraButtonsProps, 'handleClickModify'>
  ) => {
    return renderWithTheme(
      <ConfigExtraButtons {...params} handleClickModify={handleClickModifyFn} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestTestFeishuAuditConfig = system.testFeishuAuditConfig();
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
    it('render diff mode info for input', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      const systemIconBtn = getAllBySelector(
        '.system-config-button',
        baseElement
      );
      fireEvent.click(systemIconBtn[0]);
      await act(async () => jest.advanceTimersByTime(300));

      const radioItems = getAllBySelector(
        '.ant-radio-button-wrapper-in-form-item',
        baseElement
      );
      expect(radioItems.length).toBe(2);

      fireEvent.click(radioItems[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(radioItems[0]);
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('取 消')).toBeInTheDocument();
      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render popover cancel btn', async () => {
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

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: 'aa@qq.com'
        }
      });

      expect(getBySelector('#receiveEmail', baseElement)).toHaveAttribute(
        'value',
        'aa@qq.com'
      );

      expect(screen.getByText('取 消')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.getByText('取 消'));
      fireEvent.click(btnPopoverOpen);
      expect(getBySelector('#receiveEmail', baseElement)).toHaveAttribute(
        'value',
        ''
      );
    });

    it('render form item validate', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      await act(async () => jest.advanceTimersByTime(3300));
      const btnPopoverOpen = getBySelector(
        '.ant-btn[type="submit"]',
        baseElement
      );
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: 'com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(screen.getByText('手机号'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: 'phone'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render form submit success', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      await act(async () => jest.advanceTimersByTime(3300));
      const btnPopoverOpen = getBySelector(
        '.ant-btn[type="submit"]',
        baseElement
      );
      fireEvent.click(btnPopoverOpen);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '1@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(screen.getByText('正在向飞书推送消息...')).toBeInTheDocument();

      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestTestFeishuAuditConfig).toHaveBeenCalledTimes(1);
      expect(requestTestFeishuAuditConfig).toHaveBeenCalledWith({
        account: '1@a.com',
        account_type: TestFeishuConfigurationReqV1AccountTypeEnum.email
      });

      await act(async () => jest.advanceTimersByTime(400));
      expect(
        screen.getByText('已成功将审批消息推送至指定账号')
      ).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render form submit error', async () => {
      requestTestFeishuAuditConfig.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            is_message_sent_normally: false
          }
        })
      );
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true
      });

      const systemIconBtn = getAllBySelector(
        '.system-config-button',
        baseElement
      );
      fireEvent.click(systemIconBtn[0]);
      await act(async () => jest.advanceTimersByTime(300));

      const radioItems = getAllBySelector(
        '.ant-radio-button-wrapper-in-form-item',
        baseElement
      );

      fireEvent.click(radioItems[1]);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: '12345678919'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('正在向飞书推送消息...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(2400));
      expect(requestTestFeishuAuditConfig).toHaveBeenCalledTimes(1);
      expect(requestTestFeishuAuditConfig).toHaveBeenCalledWith({
        account: '12345678919',
        account_type: TestFeishuConfigurationReqV1AccountTypeEnum.phone
      });

      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('未知错误...')).toBeInTheDocument();
    });
  });
});
