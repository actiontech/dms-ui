/**
 * @test_version ce
 */

import system from '@actiontech/shared/lib/testUtil/mockApi/base/system';

import { cleanup, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import LoginConnection from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/LoginConnection-ce', () => {
  const customRender = () => {
    return superRender(<LoginConnection />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    system.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });
});
