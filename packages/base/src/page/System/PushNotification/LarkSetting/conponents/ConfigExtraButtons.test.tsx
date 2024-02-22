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
import { TestFeishuConfigurationAccountTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
      expect(handleClickModifyFn).toBeCalledTimes(1);
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

    it('render test btn snap when change data type mode', async () => {
      const { baseElement } = customRender({
        enabled: true,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const [testBtn] = getAllBySelector('.system-config-button', baseElement);
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));

      const radioBtn = getAllBySelector(
        '.ant-radio-button-wrapper-in-form-item',
        baseElement
      );
      expect(radioBtn.length).toBe(2);

      expect(
        getBySelector('.ant-input[placeholder="请输入邮箱"]', baseElement)
      ).toBeInTheDocument();
      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '1@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        getBySelector('.ant-input[placeholder="请输入邮箱"]', baseElement)
      ).toHaveAttribute('value', '1@a.com');

      fireEvent.click(radioBtn[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        getBySelector('.ant-input[placeholder="请输入手机号"]', baseElement)
      ).toBeInTheDocument();
      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: '12345678910'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        getBySelector('.ant-input[placeholder="请输入手机号"]', baseElement)
      ).toHaveAttribute('value', '12345678910');

      fireEvent.click(radioBtn[0]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        getBySelector('.ant-input[placeholder="请输入邮箱"]', baseElement)
      ).toHaveAttribute('value', '');

      fireEvent.click(radioBtn[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        getBySelector('.ant-input[placeholder="请输入手机号"]', baseElement)
      ).toHaveAttribute('value', '');
    });

    it('render test btn snap when validate item', async () => {
      const { baseElement } = customRender({
        enabled: true,
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const [testBtn] = getAllBySelector('.system-config-button', baseElement);
      fireEvent.click(testBtn);
      await act(async () => jest.advanceTimersByTime(300));

      expect(getBySelector('#receiveEmail', baseElement)).toBeInTheDocument();

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '123'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      const [, phoneBtn] = getAllBySelector(
        '.ant-radio-button-wrapper-in-form-item',
        baseElement
      );
      fireEvent.click(phoneBtn);
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: 'w'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
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

      expect(getBySelector('#receiveEmail', baseElement)).toHaveAttribute(
        'value',
        ''
      );
      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '1@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在向飞书推送消息...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(2700));
      expect(requestTestFeishuConfiguration).toBeCalledTimes(1);
      expect(requestTestFeishuConfiguration).toBeCalledWith({
        test_feishu_configuration: {
          account: '1@a.com',
          account_type: TestFeishuConfigurationAccountTypeEnum.email
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        screen.getByText('已成功将消息推送至指定账号')
      ).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when send api error', async () => {
      requestTestFeishuConfiguration.mockImplementation(() =>
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

      expect(getBySelector('#receiveEmail', baseElement)).toHaveAttribute(
        'value',
        ''
      );
      const [, phoneBtn] = getAllBySelector(
        '.ant-radio-button-wrapper-in-form-item',
        baseElement
      );
      fireEvent.click(phoneBtn);
      await act(async () => jest.advanceTimersByTime(300));

      expect(getBySelector('#receivePhone', baseElement)).toHaveAttribute(
        'value',
        ''
      );

      fireEvent.change(getBySelector('#receivePhone', baseElement), {
        target: {
          value: '12345678910'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));

      expect(screen.getByText('正在向飞书推送消息...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(2700));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(requestTestFeishuConfiguration).toBeCalledTimes(1);
      expect(requestTestFeishuConfiguration).toBeCalledWith({
        test_feishu_configuration: {
          account: '12345678910',
          account_type: TestFeishuConfigurationAccountTypeEnum.phone
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
