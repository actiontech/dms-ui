import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import WechatAuditSetting from '.';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/ProcessConnection/WechatAuditSetting', () => {
  let requestGetWechatAuditConfiguration: jest.SpyInstance;
  let requestUpdateWechatAuditConfiguration: jest.SpyInstance;

  const customRender = () => {
    return superRender(<WechatAuditSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetWechatAuditConfiguration = system.getWechatAuditConfiguration();
    requestUpdateWechatAuditConfiguration =
      system.updateWechatAuditConfiguration();
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
    expect(requestGetWechatAuditConfiguration).toHaveBeenCalled();
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
      expect(screen.getByText('启用企业微信审批')).toBeInTheDocument();

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
      expect(screen.getAllByText('取 消')[0]).toBeInTheDocument();
      expect(screen.getByText('确 认')).toBeInTheDocument();

      fireEvent.click(screen.getAllByText('取 消')[0]);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
    });

    it('render snap when click switch change and edit form info', async () => {
      requestGetWechatAuditConfiguration.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            corp_id: '',
            is_wechat_notification_enabled: true
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
        corpID: 'corp id',
        corpSecret: 'corp Secret'
      };

      fireEvent.change(getBySelector('#corpID', baseElement), {
        target: {
          value: mockFormData.corpID
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
      expect(getBySelector('#corpID', baseElement)).toHaveAttribute(
        'value',
        mockFormData.corpID
      );

      fireEvent.change(getBySelector('#corpSecret'), {
        target: { value: mockFormData.corpSecret }
      });
      await act(async () => jest.advanceTimersByTime(300));

      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('是否确认关闭当前配置？')).toBeInTheDocument();
      expect(screen.getAllByText('取 消')[0]).toBeInTheDocument();
      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2800));
    });
  });

  describe('render submit wechat audit setting', () => {
    it('render submit success', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      const switchEle = getBySelector(
        '.basic-switch-wrapper .ant-switch-inner',
        baseElement
      );
      fireEvent.click(switchEle);
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#corpID', baseElement), {
        target: {
          value: 'corp id'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(getBySelector('#corpSecret', baseElement), {
        target: {
          value: 'corp Secret'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      expect(screen.getByText('提 交')).toBeInTheDocument();
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateWechatAuditConfiguration).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateWechatAuditConfiguration).toHaveBeenCalledWith({
        corp_id: 'corp id',
        corp_secret: 'corp Secret',
        is_wechat_notification_enabled: true
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetWechatAuditConfiguration).toHaveBeenCalled();
    });
  });
});
