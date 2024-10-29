import GlobalSetting from '../GlobalSetting';
import { useNavigate } from 'react-router-dom';
import { superRender } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/GlobalSetting', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it(`render snap when "checkPagePermission" is return false`, async () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(false)
      },
      { useSpyOnMockHooks: true }
    );

    const { baseElement } = superRender(<GlobalSetting />);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('查看规则')).toBeInTheDocument();
    expect(getAllBySelector('.content-item-text').length).toBe(1);
    fireEvent.click(screen.getByText('查看规则'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalledWith('/sqle/rule');
  });

  it(`render snap when is "checkPagePermission" is return true`, async () => {
    mockUsePermission(
      {
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      { useSpyOnMockHooks: true }
    );
    const { baseElement } = superRender(<GlobalSetting />);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(getAllBySelector('.content-item-text').length).toBe(6);

    fireEvent.click(screen.getByText('用户中心'));
    expect(navigateSpy).toHaveBeenNthCalledWith(1, '/user-center');

    fireEvent.click(screen.getByText('数据源管理'));
    expect(navigateSpy).toHaveBeenNthCalledWith(2, '/data-source-management');

    fireEvent.click(screen.getByText('报表统计'));
    expect(navigateSpy).toHaveBeenNthCalledWith(3, '/sqle/report-statistics');

    fireEvent.click(screen.getByText('查看规则'));
    expect(navigateSpy).toHaveBeenNthCalledWith(4, '/sqle/rule');

    fireEvent.click(screen.getByText('规则管理'));
    expect(navigateSpy).toHaveBeenNthCalledWith(5, '/sqle/rule-manager');

    fireEvent.click(screen.getByText('系统设置'));
    expect(navigateSpy).toHaveBeenNthCalledWith(6, '/system');
  });
});
