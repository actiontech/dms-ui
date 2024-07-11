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
  const customRender = (isAdmin = false, isCertainProjectManager = false) => {
    return superRender(
      <GlobalSetting
        updateTheme={jest.fn()}
        theme={SupportTheme.LIGHT}
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

  it('render snap when is not admin', async () => {
    const { baseElement } = customRender();
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

  it('render snap when is admin', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();

    const iconSystem = getBySelector('.custom-icon-global-system', baseElement);
    fireEvent.click(iconSystem);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('用户中心')).toBeInTheDocument();
    expect(getAllBySelector('.content-item-text').length).toBe(6);
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
    expect(getAllBySelector('.content-item-text').length).toBe(2);
    fireEvent.click(screen.getByText('数据源管理'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalledWith('/global-data-source');
  });
});
