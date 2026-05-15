/**
 * @test_version ce
 */

import { cleanup, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

import Oauth from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/LoginConnection/Oauth-ce', () => {
  const customRender = () => {
    return superRender(<Oauth />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
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
  });
});
