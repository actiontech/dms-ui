import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import CloudBeaver from '.';
import cloudBeaver from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { enableSqlQueryUrlData } from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from 'sqle/src/hooks/useDatabaseType/index.test.data';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/dms-kit';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

const originLocation = window.location;
Object.defineProperty(window, 'location', {
  value: {
    ...originLocation
  },
  writable: true
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
    const { container } = superRender(<CloudBeaver />);

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

    const { container } = superRender(<CloudBeaver />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.getByText('打开SQL工作台')).toBeInTheDocument();
    expect(getSqlQueryUrlSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('打开SQL工作台'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getSqlQueryUrlSpy).toHaveBeenCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith(
      enableSqlQueryUrlData.sql_query_root_uri,
      '_blank'
    );
  });

  it('should auto replace to cloud beaver when "OPEN_CLOUD_BEAVER_URL_PARAM_NAME" in location search', async () => {
    superRender(<CloudBeaver />, undefined, {
      routerProps: {
        initialEntries: [
          `/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`
        ]
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(window.location.href).not.toBe(
      enableSqlQueryUrlData.sql_query_root_uri
    );

    cleanup();

    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: enableSqlQueryUrlData
      })
    );
    superRender(<CloudBeaver />, undefined, {
      routerProps: {
        initialEntries: [
          `/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`
        ]
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(window.location.href).toBe(enableSqlQueryUrlData.sql_query_root_uri);
  });
});
