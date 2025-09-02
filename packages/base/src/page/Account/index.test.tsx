import { useDispatch } from 'react-redux';
import account from '../../testUtils/mockApi/account';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import Account from '.';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import { mockUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe.skip('test base/page/Account', () => {
  const scopeDispatch = jest.fn();
  let updateCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    updateCurrentUserSpy = account.updateCurrentUser();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    mockUseUserInfo();
    const { baseElement } = renderWithTheme(<Account />);
    expect(baseElement).toMatchSnapshot();

    expect(mockUserInfo.getUserInfo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('修改密码'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when "getUserInfoLoading" is equal true', () => {
    mockUseUserInfo({ getUserInfoLoading: true });
    const { baseElement } = renderWithTheme(<Account />);
    expect(baseElement).toMatchSnapshot();
  });
});
