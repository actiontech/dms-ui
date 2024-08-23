import { screen, cleanup, act } from '@testing-library/react';
import SqlManagementExceptionList from '../';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import blacklist from '../../../testUtils/mockApi/blacklist';
import { mockBlacklistData } from '../../../testUtils/mockApi/blacklist/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector, useDispatch } from 'react-redux';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/Whitelist/SqlManagementExceptionList', () => {
  let getBlacklistSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getBlacklistSpy = blacklist.getBlacklist();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlManagementException: { modalStatus: {} }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render sqlManagementException list', async () => {
    const { baseElement } = superRender(<SqlManagementExceptionList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBlacklistSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加管控SQL例外')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(screen.queryAllByText('删 除')).toHaveLength(
      mockBlacklistData.length
    );
    expect(screen.queryAllByText('编 辑')).toHaveLength(
      mockBlacklistData.length
    );
  });
});
