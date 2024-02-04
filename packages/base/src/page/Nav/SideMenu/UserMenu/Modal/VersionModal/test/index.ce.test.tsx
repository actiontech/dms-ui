/**
 * @test_version ce
 */

import VersionModal from '..';

import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { superRender } from '../../../../../../../testUtils/customRender';

describe('base/Nav/SideMenu/UserMenu/VersionModal-ce', () => {
  const VersionModalCloseFn = jest.fn();
  const customRender = (open: boolean = false) => {
    return superRender(
      <VersionModal open={open} setVersionModalClose={VersionModalCloseFn} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('知道了'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(VersionModalCloseFn).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
