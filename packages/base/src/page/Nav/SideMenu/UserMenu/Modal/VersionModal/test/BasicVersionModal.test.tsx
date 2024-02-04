import BasicVersionModal from '../BasicVersionModal';

import { cleanup, fireEvent, act } from '@testing-library/react';
import { mockVersionInfo } from '../../../../../../../page/Nav/SideMenu/testUtils/mockVersionInfo';
import { superRender } from '../../../../../../../testUtils/customRender';
import { VersionEnum } from '../../../index.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/Nav/SideMenu/UserMenu/BasicVersionModal', () => {
  const VersionModalCloseFn = jest.fn();
  const customRender = (
    open: boolean = false,
    versions: VersionEnum[] = []
  ) => {
    return superRender(
      <BasicVersionModal
        open={open}
        versions={versions}
        setVersionModalClose={VersionModalCloseFn}
        feature="feature"
        desc="desc"
      />
    );
  };
  beforeEach(() => {
    jest.useFakeTimers();
    mockVersionInfo();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true & version data is empty', () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true & version data', async () => {
    const { baseElement } = customRender(true, [
      VersionEnum.DMS,
      VersionEnum.SQLE
    ]);
    expect(baseElement).toMatchSnapshot();

    const iconClosed = getBySelector('.ant-modal-close', baseElement);
    fireEvent.click(iconClosed);
    await act(async () => jest.advanceTimersByTime(500));
    expect(VersionModalCloseFn).toBeCalled();
  });
});
