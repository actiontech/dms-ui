import ConfigExtraButtons, {
  typeConfigExtraButtons
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';

describe('base/System/PushNotification/SMTPSetting/ConfigExtraButtons', () => {
  let requestTestSMTPConfigurationSuccess: jest.SpyInstance;
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
    requestTestSMTPConfigurationSuccess = system.testSMTPConfigSuccess();
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
        getBySelector('input[ placeholder="请输入接收邮箱"]', baseElement)
      ).toBeInTheDocument();

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '1@q.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestSMTPConfigurationSuccess).toBeCalled();
      expect(requestTestSMTPConfigurationSuccess).toBeCalledWith({
        test_smtp_configuration: {
          recipient_addr: '1@q.com'
        }
      });
    });

    it('render form submit error', async () => {
      const requestTestSMTPConfigurationError = system.testSMTPConfigFail();

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

      expect(
        getBySelector('input[ placeholder="请输入接收邮箱"]', baseElement)
      ).toBeInTheDocument();

      fireEvent.change(getBySelector('#receiveEmail', baseElement), {
        target: {
          value: '2@a.com'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestSMTPConfigurationError).toBeCalledWith({
        test_smtp_configuration: {
          recipient_addr: '2@a.com'
        }
      });
      expect(baseElement).toMatchSnapshot();
    });
  });
});
