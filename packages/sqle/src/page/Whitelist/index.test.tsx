import { screen, cleanup, act } from '@testing-library/react';
import WhiteList from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import auditWhiteList from '../../testUtils/mockApi/auditWhiteList';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('slqe/Whitelist', () => {
  let whiteListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    whiteListSpy = auditWhiteList.getAuditWhitelist();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } }
      })
    );
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render white list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<WhiteList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(whiteListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加审核SQL例外')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
  });
});
