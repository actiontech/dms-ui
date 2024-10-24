import GlobalSetting from '../GlobalSetting';
import { useNavigate } from 'react-router-dom';
import { SupportTheme } from 'sqle/src/theme';

import { superRender } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/GlobalSetting', () => {
  const navigateSpy = jest.fn();
  const customRender = (
    isAdmin = false,
    isCertainProjectManager = false,
    hasGlobalViewingPermission = false
  ) => {
    return superRender(
      <GlobalSetting
        hasGlobalViewingPermission={hasGlobalViewingPermission}
        isAdmin={isAdmin}
        isCertainProjectManager={isCertainProjectManager}
      />
    );
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it(`render snap when is not admin and hasn't global view permission`, async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it(`render snap when is not admin and has global view permission`, async () => {
    const { baseElement } = customRender(false, false, true);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(getAllBySelector('.content-item-text').length).toBe(4);
  });

  it('render snap when is admin', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('用户中心')).toBeInTheDocument();
    expect(getAllBySelector('.content-item-text').length).toBe(4);
    fireEvent.click(screen.getByText('用户中心'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalledWith('/user-center');
  });

  it('render snap when isCertainProjectManager is true', async () => {
    const { baseElement } = customRender(false, true);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('数据源管理')).toBeInTheDocument();
    expect(getAllBySelector('.content-item-text').length).toBe(1);
    fireEvent.click(screen.getByText('数据源管理'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalledWith('/data-source-management');
  });
});
