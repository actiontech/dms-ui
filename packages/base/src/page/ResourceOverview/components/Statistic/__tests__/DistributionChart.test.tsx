import ResourceOverviewDistributionChart from '../DistributionChart';
import resourceOverview from '../../../../../testUtils/mockApi/resourceOverview';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '../../../../../testUtils/customRender';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { PieConfig } from '@ant-design/plots';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Pie: jest.requireActual('@ant-design/plots').PieWithCustomRenderCalled({
      statistic: {
        title: {
          customHtml: (props: PieConfig) => {
            return [null, null, null, props.data];
          }
        }
      },
      tooltip: {
        customContent: (props: PieConfig) => {
          return [
            '',
            [
              {
                color: '#6094FC',
                name: props.data[0]?.name,
                value: props.data[0]?.value
              }
            ]
          ];
        }
      }
    })
  };
});

describe('base/page/ResourceOverview/Statictis/DistributionChart', () => {
  let getResourceOverviewResourceTypeDistributionV1Spy: jest.SpyInstance;
  beforeEach(() => {
    getResourceOverviewResourceTypeDistributionV1Spy =
      resourceOverview.getResourceOverviewResourceTypeDistributionV1();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = superRender(<ResourceOverviewDistributionChart />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(
      getResourceOverviewResourceTypeDistributionV1Spy
    ).toHaveBeenCalledTimes(1);
  });

  it('render chart snap when api return empty', async () => {
    getResourceOverviewResourceTypeDistributionV1Spy.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    superRender(<ResourceOverviewDistributionChart />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      getResourceOverviewResourceTypeDistributionV1Spy
    ).toHaveBeenCalledTimes(1);
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      getResourceOverviewResourceTypeDistributionV1Spy
    ).toHaveBeenCalledTimes(2);
  });

  it('render chart when request api faild', async () => {
    getResourceOverviewResourceTypeDistributionV1Spy.mockImplementation(() =>
      createSpyFailResponse({
        message: 'test error'
      })
    );
    superRender(<ResourceOverviewDistributionChart />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('test error')).toBeInTheDocument();
  });

  it('should refresh distribution chart data when emit Refresh_Resource_Overview_Page event', async () => {
    superRender(<ResourceOverviewDistributionChart />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      getResourceOverviewResourceTypeDistributionV1Spy
    ).toHaveBeenCalledTimes(1);
    await act(async () => {
      EventEmitter.emit(EmitterKey.Refresh_Resource_Overview_Page);
      await jest.advanceTimersByTime(3000);
    });
    expect(
      getResourceOverviewResourceTypeDistributionV1Spy
    ).toHaveBeenCalledTimes(2);
  });
});
