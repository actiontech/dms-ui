/**
 * @test_version ce
 */

import system from '../../../testUtils/mockApi/system';

import { cleanup, act } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import LoginConnection from '.';

describe('base/System/LoginConnection-ce', () => {
  const customRender = () => {
    return renderWithTheme(<LoginConnection />);
  };

  beforeEach(() => {
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
