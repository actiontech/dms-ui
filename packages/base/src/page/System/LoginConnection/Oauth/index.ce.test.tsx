/**
 * @test_version ce
 */


import { cleanup, act } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import Oauth from '.';

describe('base/System/LoginConnection/Oauth-ce', () => {
  const customRender = () => {
    return renderWithTheme(<Oauth />);
  };

  beforeEach(() => {
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
})
