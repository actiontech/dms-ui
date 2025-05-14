import { baseSuperRender } from '../../../testUtils/superRender';
import ResourceOverview from '../index';
import resourceOverview from '../../../testUtils/mockApi/resourceOverview';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { cleanup, act, fireEvent } from '@testing-library/react';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import project from '../../../testUtils/mockApi/project';
import dbServices from '../../../testUtils/mockApi/dbServices';

describe('base/page/ResourceOverview', () => {
  beforeEach(() => {
    resourceOverview.mockAllApi();
    project.mockAllApi();
    dbServices.mockAllApi();
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = baseSuperRender(<ResourceOverview />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  it('should emit Refresh_Resource_Overview_Page event when click refresh button', async () => {
    const emitSpy = jest.spyOn(EventEmitter, 'emit');
    baseSuperRender(<ResourceOverview />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    fireEvent.click(getBySelector('.ant-btn-icon-only'));
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Resource_Overview_Page
    );
  });
});
