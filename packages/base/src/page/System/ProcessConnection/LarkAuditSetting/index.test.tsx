import system from '../../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import LarkAuditSetting from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/ProcessConnection/LarkAuditSetting', () => {
  let requestGetFeishuAuditConfiguration: jest.SpyInstance;
  let requestUpdateFeishuAuditConfiguration: jest.SpyInstance;

  const customRender = () => {
    return superRender(<LarkAuditSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetFeishuAuditConfiguration = system.getFeishuAuditConfiguration();
    requestUpdateFeishuAuditConfiguration =
      system.updateFeishuAuditConfiguration();
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
    expect(requestGetFeishuAuditConfiguration).toHaveBeenCalled();
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
      expect(screen.getByText('启用飞书审批')).toBeInTheDocument();

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
      expect(screen.getAllByText('取 消')[0]).toBeInTheDocument();
      expect(screen.getByText('确 定')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('取 消')[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 定'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render submit LarkAudit setting', () => {
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
      expect(requestUpdateFeishuAuditConfiguration).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateFeishuAuditConfiguration).toHaveBeenCalledWith({
        app_id: 'app Key',
        app_secret: 'app Secret',
        is_feishu_notification_enabled: true
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetFeishuAuditConfiguration).toHaveBeenCalled();
    });
  });
});
