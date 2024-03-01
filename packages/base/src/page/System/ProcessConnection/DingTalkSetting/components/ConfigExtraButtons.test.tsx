import ConfigExtraButtons, {
  ConfigExtraButtonsProps
} from './ConfigExtraButtons';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import system from '../../../../../testUtils/mockApi/system';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/System/ProcessConnection/DingTalkSetting/ConfigExtraButtons', () => {
  let requestTestDingTalkConfig: jest.SpyInstance;
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
    requestTestDingTalkConfig = system.testDingTalkConfig();
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
        extraButtonsVisible: true
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render extraButtonsVisible is false', () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: false
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render snap form', () => {
    it('render submit btn event change', async () => {
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const btnSubmit = getBySelector('.ant-btn[type="submit"]', baseElement);
      fireEvent.mouseOver(btnSubmit);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      fireEvent.click(btnSubmit);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestTestDingTalkConfig).toHaveBeenCalled();
    });

    it('render submit btn when api error', async () => {
      requestTestDingTalkConfig.mockImplementation(() =>
        createSpySuccessResponse({ send_error_message: 'error info' })
      );
      const { baseElement } = customRender({
        isConfigClosed: false,
        extraButtonsVisible: true
      });

      const btnSubmit = getBySelector('.ant-btn[type="submit"]', baseElement);
      fireEvent.click(btnSubmit);
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTestDingTalkConfig).toHaveBeenCalled();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
