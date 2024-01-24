import ConfigExtraButtons, { typeConfigExtraButtons } from './ConfigExtraButtons';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';
import { createSpyErrorResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
      expect(requestTestWeChatConfiguration).toBeCalled();
      expect(requestTestWeChatConfiguration).toBeCalledWith({
        test_wechat_configuration: {
          recipient_id: 'id val'
        }
      });
    });

    it('render form when api error', async () => {
      requestTestWeChatConfiguration.mockImplementation(() =>
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

      fireEvent.change(getBySelector('#receiveId', baseElement), {
        target: {
          value: 'id val2'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestWeChatConfiguration).toBeCalledWith({
        test_wechat_configuration: {
          recipient_id: 'id val2'
        }
      });
    })
  })
});
