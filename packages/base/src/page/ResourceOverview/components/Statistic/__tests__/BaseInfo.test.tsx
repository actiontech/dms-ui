import { superRender } from '../../../../../testUtils/customRender';
import ResourceOverviewBaseInfo from '../BaseInfo';
import resourceOverview from '../../../../../testUtils/mockApi/resourceOverview';
import { cleanup, act } from '@testing-library/react';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';

describe('base/page/ResourceOverview/Statictis/BaseInfo', () => {
  let getResourceOverviewStatisticsV1Spy: jest.SpyInstance;
  beforeEach(() => {
    getResourceOverviewStatisticsV1Spy =
      resourceOverview.getResourceOverviewStatisticsV1();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = superRender(<ResourceOverviewBaseInfo />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(getResourceOverviewStatisticsV1Spy).toHaveBeenCalledTimes(1);
  });

  it('should refresh statictis data when emit Refresh_Resource_Overview_Page event', async () => {
    superRender(<ResourceOverviewBaseInfo />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getResourceOverviewStatisticsV1Spy).toHaveBeenCalledTimes(1);
    await act(async () => {
      EventEmitter.emit(EmitterKey.Refresh_Resource_Overview_Page);
      await jest.advanceTimersByTime(300);
    });
    expect(getResourceOverviewStatisticsV1Spy).toHaveBeenCalledTimes(2);
  });
});
