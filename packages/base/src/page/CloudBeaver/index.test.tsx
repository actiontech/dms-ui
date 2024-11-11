import { renderWithThemeAndRouter } from '@actiontech/shared/lib/testUtil/customRender';
import CloudBeaver from '.';
import cloudBeaver from '../../testUtils/mockApi/cloudBeaver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { enableSqlQueryUrlData } from '../../testUtils/mockApi/cloudBeaver/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import userCenter from '../../testUtils/mockApi/userCenter';
import dbServices from '../../testUtils/mockApi/dbServices';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from 'sqle/src/hooks/useDatabaseType/index.test.data';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/shared/lib/data/routePaths';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/page/CloudBeaver', () => {
  let getSqlQueryUrlSpy: jest.SpyInstance;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    getSqlQueryUrlSpy = cloudBeaver.getSqlQueryUrl();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    cloudBeaver.mockAllApi();
    userCenter.getMemberTips();
    dbServices.ListDBServicesTips();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        cloudBeaver: {
          modalStatus: {}
        },
        whitelist: { modalStatus: {} },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot when sql query is disabled', async () => {
    const { container } = renderWithThemeAndRouter(<CloudBeaver />);

    expect(container).toMatchSnapshot();
    expect(getSqlQueryUrlSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('打开SQL工作台')).toHaveLength(0);
    expect(container).toMatchSnapshot();
  });

  it('should render jump to cloud beaver when sql query is enable', async () => {
    global.open = jest.fn();
    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: enableSqlQueryUrlData
      })
    );

    const { container } = renderWithThemeAndRouter(<CloudBeaver />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.getByText('打开SQL工作台')).toBeInTheDocument();

    fireEvent.click(screen.getByText('打开SQL工作台'));
    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith(
      enableSqlQueryUrlData.sql_query_root_uri
    );
  });

  it('should auto jump to cloud beaver when "OPEN_CLOUD_BEAVER_URL_PARAM_NAME" in location search', async () => {
    global.open = jest.fn();

    renderWithThemeAndRouter(<CloudBeaver />, undefined, {
      initialEntries: [`/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`]
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(global.open).not.toHaveBeenCalled();

    cleanup();

    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: enableSqlQueryUrlData
      })
    );
    renderWithThemeAndRouter(<CloudBeaver />, undefined, {
      initialEntries: [`/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`]
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith(
      enableSqlQueryUrlData.sql_query_root_uri
    );
  });
});
