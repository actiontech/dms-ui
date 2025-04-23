/**
 * @test_version ce
 */
import { useDispatch } from 'react-redux';
import Account from '.';
import { mockUseUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserInfo';
import { mockUserInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { superRender } from '../../testUtils/customRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/Account ce', () => {
  const scopeDispatch = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    mockUseUserInfo();
    const { baseElement } = superRender(<Account />);
    expect(baseElement).toMatchSnapshot();
    expect(mockUserInfo.getUserInfo).toHaveBeenCalledTimes(1);
  });
});
