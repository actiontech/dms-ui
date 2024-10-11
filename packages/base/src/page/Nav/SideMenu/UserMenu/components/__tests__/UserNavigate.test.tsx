import UserNavigate from '../UserNavigate';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dms from '../../../../../../testUtils/mockApi/global';
import { LocalStorageWrapper } from '@actiontech/shared';
import { ModalName } from '../../../../../../data/ModalName';
import {
  CompanyNoticeDisplayStatusEnum,
  SupportLanguage
} from '@actiontech/shared/lib/enum';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import account from '../../../../../../testUtils/mockApi/account';

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
  let requestUpdateCurrentUser: jest.SpyInstance;

  const mockClearUserInfo = jest.fn();
  const customRender = () => {
    return superRender(
      <UserNavigate
        language={SupportLanguage.zhCN}
        username="Test name"
        onOpenVersionModal={versionModalOpenFn}
      />
    );
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    jest.useFakeTimers();
    requestGetCompanyNotice = dms.getCompanyNotice();
    requestDelSession = dms.delSession();
    requestUpdateCurrentUser = account.updateCurrentUser();
    mockUseUserInfo({ clearUserInfo: mockClearUserInfo });
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
    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(scopeDispatch).toHaveBeenCalled();
    expect(scopeDispatch).toHaveBeenCalledWith({
      payload: { modalName: ModalName.Company_Notice, status: true },
      type: 'nav/updateModalStatus'
    });

    const iconUserName = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconUserName);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('系统公告')).toBeInTheDocument();

    expect(screen.getByText('个人中心')).toBeInTheDocument();
    fireEvent.click(screen.getByText('个人中心'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/account');
  });

  it('render snap when click logout btn', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));

    const iconUserName = getBySelector('.ant-avatar-string', baseElement);
    fireEvent.click(iconUserName);
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(screen.getByText('退出登录'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(requestDelSession).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('退出登录').parentNode).not.toHaveClass(
      'content-item-disabled'
    );

    expect(requestDelSession).toHaveBeenCalledTimes(1);
    expect(mockClearUserInfo).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/login', { replace: true });
  });

  it(`should update the user's language when a language menu item is clicked.`, async () => {
    const original = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() }
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.ant-avatar-string', baseElement));

    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(screen.getByText('语言'));

    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('中文'));

    expect(requestUpdateCurrentUser).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('英文'));
    expect(requestUpdateCurrentUser).toHaveBeenCalledTimes(1);
    expect(requestUpdateCurrentUser).toHaveBeenCalledWith({
      current_user: { language: SupportLanguage.enUS }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(scopeDispatch).toHaveBeenCalledTimes(1);
    expect(scopeDispatch).toHaveBeenCalledWith({
      payload: { language: SupportLanguage.enUS, store: true },
      type: 'user/updateLanguage'
    });
    expect(window.location.reload).toHaveBeenCalledTimes(1);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original
    });
  });

  it('should call onOpenVersionModal when the "viewVersion" menu item is clicked', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.ant-avatar-string', baseElement));

    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(screen.getByText('查看版本号'));
    expect(versionModalOpenFn).toHaveBeenCalledTimes(1);
  });
});
