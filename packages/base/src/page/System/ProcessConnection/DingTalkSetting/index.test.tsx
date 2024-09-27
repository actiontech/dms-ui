import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import DingTalkSetting from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/ProcessConnection/DingTalkSetting', () => {
  let requestGetDingTalkConfiguration: jest.SpyInstance;
  let requestUpdateDingTalkConfiguration: jest.SpyInstance;

  const customRender = () => {
    return superRender(<DingTalkSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetDingTalkConfiguration = system.getDingTalkConfiguration();
    requestUpdateDingTalkConfiguration = system.updateDingTalkConfiguration();
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
    expect(requestGetDingTalkConfiguration).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when user is not admin', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  describe('render switch cancel btn', () => {
    it('render snap when click cont cancel btn', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('启用钉钉审批')).toBeInTheDocument();

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
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

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.mouseEnter(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      expect(
        screen.getByText(
          '关闭配置后当前的编辑信息将不会被保留，是否确认关闭配置？'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('OK'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
    });

    it('render snap when click switch change and edit form info', async () => {
      requestGetDingTalkConfiguration.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            app_key: '',
            is_enable_ding_talk_notify: true
          }
        })
      );
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));

      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(300));

      const mockFormData = {
        appKey: 'app Key',
        appSecret: 'app Secret'
      };

      fireEvent.change(getBySelector('#appKey', baseElement), {
        target: {
          value: mockFormData.appKey
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(getBySelector('#appKey', baseElement)).toHaveAttribute(
        'value',
        mockFormData.appKey
      );

      fireEvent.change(screen.getByLabelText('AppSecret'), {
        target: { value: mockFormData.appSecret }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('OK')).toBeInTheDocument();
      fireEvent.click(screen.getByText('OK'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2800));
    });
  });

  describe('render submit DingTalk setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#appKey', baseElement), {
        target: {
          value: 'app Key'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#appSecret', baseElement), {
        target: {
          value: 'app Secret'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateDingTalkConfiguration).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateDingTalkConfiguration).toHaveBeenCalledWith({
        app_key: 'app Key',
        app_secret: 'app Secret',
        is_enable_ding_talk_notify: true
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetDingTalkConfiguration).toHaveBeenCalled();
    });
  });
});
