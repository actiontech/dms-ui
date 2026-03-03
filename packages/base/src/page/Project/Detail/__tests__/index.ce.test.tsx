/**
 * @test_version ce
 */

import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import CEIndexProjectDetail from '../index';
import { act, cleanup, screen } from '@testing-library/react';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { useDispatch } from 'react-redux';
import { userOpPermissionMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter/data';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project/detail/ce', () => {
  const dispatchSpy = jest.fn();
  let requestGetUserOpPermissionSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    requestGetUserOpPermissionSpy = userCenter.getUserOpPermission();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should replace to "/" when pathname is "/project"', async () => {
    const [, LocationComponent] = renderLocationDisplay();
    superRender(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { routerProps: { initialEntries: ['/project/overview'] } }
    );

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/project/overview'
    );

    expect(requestGetUserOpPermissionSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'permission/updateUserOperationPermissions',
      payload: userOpPermissionMockData
    });

    cleanup();

    superRender(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { routerProps: { initialEntries: ['/project'] } }
    );
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});
