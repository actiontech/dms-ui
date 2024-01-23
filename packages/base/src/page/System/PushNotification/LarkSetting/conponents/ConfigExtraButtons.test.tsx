import ConfigExtraButtons, {
  ConfigExtraButtonsProps
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';
import { TestFeishuConfigurationAccountTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/System/PushNotification/LarkSetting/ConfigExtraButtons', () => {
  let requestTestFeishuConfiguration: jest.SpyInstance;
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
    requestTestFeishuConfiguration = system.testLarkConfig();
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
        enabled: false
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render snap form', () => {
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
      expect(screen.getByText('取 消')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(300));
      expect(baseElement).toMatchSnapshot();
    });

    it('render form validate', async () => {
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
        getBySelector('input[ placeholder="请输入邮箱"]', baseElement)
      ).toBeInTheDocument();
      expect(screen.getByText('手机号')).toBeInTheDocument();
      fireEvent.click(screen.getByText('手机号'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(
        getBySelector('input[ placeholder="请输入手机号"]', baseElement)
      ).toBeInTheDocument();

      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: '15115215134'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在向飞书推送消息...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestFeishuConfiguration).toBeCalled();
      expect(requestTestFeishuConfiguration).toBeCalledWith({
        test_feishu_configuration: {
          account: '15115215134',
          account_type: TestFeishuConfigurationAccountTypeEnum.phone
        }
      });
      expect(screen.getByText('已成功将消息推送至指定账号')).toBeInTheDocument();
    });

    it('render form when api error', async () => {
      requestTestFeishuConfiguration.mockImplementation(() =>
        createSpyErrorResponse({ error_message: 'error info' })
      );
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
          value: '1@q.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestFeishuConfiguration).toBeCalled();
      expect(requestTestFeishuConfiguration).toBeCalledWith({
        test_feishu_configuration: {
          account: '1@q.com',
          account_type: TestFeishuConfigurationAccountTypeEnum.email
        }
      });
    });
  })
});
