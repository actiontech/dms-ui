/**
 * @test_version ce
 */
import CloudBeaver from '.';
import cloudBeaver from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { enableSqlQueryUrlData } from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver/data';
import { baseSuperRender } from '../../testUtils/superRender';
import { OPEN_CLOUD_BEAVER_URL_PARAM_NAME } from '@actiontech/dms-kit';

describe('test base/page/CloudBeaver', () => {
  let getSqlQueryUrlSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getSqlQueryUrlSpy = cloudBeaver.getSqlQueryUrl();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot when sql query is disabled', async () => {
    const { container } = baseSuperRender(<CloudBeaver />);

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

    const { container } = baseSuperRender(<CloudBeaver />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
    expect(screen.getByText('打开SQL工作台')).toBeInTheDocument();

    fireEvent.click(screen.getByText('打开SQL工作台'));
    expect(global.open).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(global.open).toHaveBeenCalledTimes(1);
    expect(global.open).toHaveBeenCalledWith(
      enableSqlQueryUrlData.sql_query_root_uri,
      '_blank'
    );
  });

  it('should auto replace to cloud beaver when "OPEN_CLOUD_BEAVER_URL_PARAM_NAME" in location search', async () => {
    const originLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: {
        ...originLocation
      },
      writable: true
    });

    baseSuperRender(<CloudBeaver />, undefined, {
      routerProps: {
        initialEntries: [
          `/cloudBeaver?${OPEN_CLOUD_BEAVER_URL_PARAM_NAME}=true`
        ]
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    cleanup();

    getSqlQueryUrlSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: enableSqlQueryUrlData
      })
    );
    baseSuperRender(<CloudBeaver />, undefined, {
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
