import { superRender } from '../../../../../testUtils/customRender';
import ResourceOverviewStatistic from '../index';
import resourceOverview from '../../../../../testUtils/mockApi/resourceOverview';
import { cleanup, act } from '@testing-library/react';

describe('base/page/ResourceOverview/Statictis', () => {
  beforeEach(() => {
    resourceOverview.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = superRender(<ResourceOverviewStatistic />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});
