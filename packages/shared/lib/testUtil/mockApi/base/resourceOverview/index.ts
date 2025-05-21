import { createSpySuccessResponse, MockSpyApy } from '../../common';
import { ResourceOverviewService } from '../../../../api/base';
import {
  mockResourceListData,
  mockResourceTypeDistributionData,
  mockResourceOverviewStatisticsData,
  mockResourceOverviewTopologyData
} from './data';

class MockResourceOverviewApi implements MockSpyApy {
  public mockAllApi(): void {
    this.downloadResourceOverviewList();
    this.getResourceOverviewResourceListV1();
    this.getResourceOverviewResourceTypeDistributionV1();
    this.getResourceOverviewStatisticsV1();
    this.getResourceOverviewTopologyV1();
  }

  public downloadResourceOverviewList() {
    const spy = jest.spyOn(
      ResourceOverviewService,
      'DownloadResourceOverviewList'
    );
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getResourceOverviewResourceListV1() {
    const spy = jest.spyOn(
      ResourceOverviewService,
      'GetResourceOverviewResourceListV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockResourceListData,
        total_nums: mockResourceListData.length
      })
    );
    return spy;
  }

  public getResourceOverviewResourceTypeDistributionV1() {
    const spy = jest.spyOn(
      ResourceOverviewService,
      'GetResourceOverviewResourceTypeDistributionV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockResourceTypeDistributionData
      })
    );
    return spy;
  }

  public getResourceOverviewStatisticsV1() {
    const spy = jest.spyOn(
      ResourceOverviewService,
      'GetResourceOverviewStatisticsV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockResourceOverviewStatisticsData
      })
    );
    return spy;
  }

  public getResourceOverviewTopologyV1() {
    const spy = jest.spyOn(
      ResourceOverviewService,
      'GetResourceOverviewTopologyV1'
    );
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockResourceOverviewTopologyData
      })
    );
    return spy;
  }
}

export default new MockResourceOverviewApi();
