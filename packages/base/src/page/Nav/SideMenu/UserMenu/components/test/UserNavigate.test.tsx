import UserNavigate from '../UserNavigate';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import dms from '../../../../../../testUtils/mockApi/global';
import { LocalStorageWrapper } from '@actiontech/shared';
import { ModalName } from '../../../../../../data/ModalName';
import { CompanyNoticeDisplayStatusEnum } from '@actiontech/shared/lib/enum';
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

describe('base/page/Nav/SideMenu/UserNavigate-ee', () => {
  const versionModalOpenFn = jest.fn();
  const navigateSpy = jest.fn();
  const scopeDispatch = jest.fn();
  let requestGetCompanyNotice: jest.SpyInstance;
  let requestDelSession: jest.SpyInstance;
  const customRender = () => {
    return superRender(
      <UserNavigate
        username="Test name"
        setVersionModalOpen={versionModalOpenFn}
      />
    );
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    jest.useFakeTimers();
    requestGetCompanyNotice = dms.getCompanyNotice();
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
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetCompanyNotice).toHaveBeenCalled();
    expect(scopeDispatch).toHaveBeenCalled();
    expect(scopeDispatch).toHaveBeenCalledWith({
      payload: { modalName: ModalName.Company_Notice, status: true },
      type: 'nav/updateModalStatus'
    });

    const iconUserName = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconUserName);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('个人中心')).toBeInTheDocument();
    fireEvent.click(screen.getByText('个人中心'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/account');
  });

  it('render snap when click logout btn', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    const iconUserName = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconUserName);
    await act(async () => jest.advanceTimersByTime(500));

    expect(screen.getByText('退出登录')).toBeInTheDocument();
    fireEvent.click(screen.getByText('退出登录'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(requestDelSession).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });
});
