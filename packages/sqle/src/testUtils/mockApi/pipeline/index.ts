import pipeline from '@actiontech/shared/lib/api/sqle/service/pipeline';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockPipelineListData, mockPipelineDetailData } from './data';

class Pipeline implements MockSpyApy {
  public mockAllApi(): void {
    this.getPipelines();
    this.deletePipeline();
    this.createPipeline();
    this.updatePipeline();
    this.getPipelineDetail();
  }

  public getPipelines() {
    const spy = jest.spyOn(pipeline, 'getPipelinesV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockPipelineListData,
        total_nums: mockPipelineListData.length
      })
    );
    return spy;
  }

  public deletePipeline() {
    const spy = jest.spyOn(pipeline, 'deletePipelineV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public createPipeline() {
    const spy = jest.spyOn(pipeline, 'createPipelineV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: { pipeline_id: 1 } })
    );
    return spy;
  }

  public updatePipeline() {
    const spy = jest.spyOn(pipeline, 'updatePipelineV1');
    spy.mockImplementation(() => createSpySuccessResponse({}));
    return spy;
  }

  public getPipelineDetail() {
    const spy = jest.spyOn(pipeline, 'getPipelineDetailV1');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockPipelineDetailData })
    );
    return spy;
  }
}

export default new Pipeline();
