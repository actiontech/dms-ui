/**
 * @test_version ce
 */

import UserNavigate from '../UserNavigate';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { LocalStorageWrapper, SupportTheme } from '@actiontech/dms-kit';
import {
  CompanyNoticeDisplayStatusEnum,
  SupportLanguage
} from '@actiontech/dms-kit';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/UserNavigate-ce', () => {
  const versionModalOpenFn = jest.fn();
  const navigateSpy = jest.fn();
  const scopeDispatch = jest.fn();
  let requestDelSession: jest.SpyInstance;
  const changeThemeFn = jest.fn();

  const customRender = () => {
    return baseSuperRender(
      <UserNavigate
        language={SupportLanguage.zhCN}
        username="Test name"
        onOpenVersionModal={versionModalOpenFn}
        currentTheme={SupportTheme.LIGHT}
        changeTheme={changeThemeFn}
      />
    );
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    jest.useFakeTimers();
    requestDelSession = dms.delSession();
    mockUseUserInfo();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', async () => {
    jest
      .spyOn(LocalStorageWrapper, 'get')
      .mockReturnValue(CompanyNoticeDisplayStatusEnum.NotDisplayed);
    const requestGetCompanyNotice = dms.getCompanyNotice();

    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(0);
    const iconUserName = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconUserName);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.queryByText('系统公告')).not.toBeInTheDocument();

    expect(screen.getByText('个人中心')).toBeInTheDocument();
    fireEvent.click(screen.getByText('个人中心'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/account');
  });
});
