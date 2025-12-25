import { useDispatch } from 'react-redux';
import account from '@actiontech/shared/lib/testUtil/mockApi/base/account';
import Account from '.';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import { mockUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../testUtils/superRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/Account', () => {
  const scopeDispatch = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    account.updateCurrentUser();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    mockUseUserInfo();
    const { baseElement } = baseSuperRender(<Account />);
    expect(baseElement).toMatchSnapshot();

    expect(mockUserInfo.getUserInfo).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('修改密码'));

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when "getUserInfoLoading" is equal true', () => {
    mockUseUserInfo({ getUserInfoLoading: true });
    const { baseElement } = baseSuperRender(<Account />);
    expect(baseElement).toMatchSnapshot();
  });
});
