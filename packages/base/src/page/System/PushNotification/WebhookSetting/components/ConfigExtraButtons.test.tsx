import ConfigExtraButtons, {
  ConfigExtraButtonsProps
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/PushNotification/WebhookSetting/ConfigExtraButtons', () => {
  let requestTestWebHookConfiguration: jest.SpyInstance;
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
    requestTestWebHookConfiguration = system.testWebhookConfig();
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
        enabled: false,
        msgUrl: ''
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render extraButtonsVisible is false', () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: false,
        enabled: false,
        msgUrl: 'a.com'
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render snap form', () => {
    it('render submit btn event change', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true,
        msgUrl: ''
      });

      const btnSubmit = getAllBySelector(
        '.system-config-button',
        baseElement
      )[0];
      fireEvent.mouseOver(btnSubmit);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(btnSubmit);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestTestWebHookConfiguration).toHaveBeenCalled();
    });

    it('render submit btn when api error', async () => {
      requestTestWebHookConfiguration.mockImplementation(() =>
        createSpySuccessResponse({ send_error_message: 'error info' })
      );
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true,
        enabled: true,
        msgUrl: ''
      });

      const btnSubmit = getAllBySelector(
        '.system-config-button',
        baseElement
      )[0];
      fireEvent.click(btnSubmit);
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestWebHookConfiguration).toHaveBeenCalled();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
