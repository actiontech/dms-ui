import knowledge_base from '@actiontech/shared/lib/api/sqle/service/knowledge_base';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  mockKnowledgeBaseTagListData,
  mockKnowledgeBaseListData,
  mockKnowledgeGraphData
} from './data';

class KnowledgeBase implements MockSpyApy {
  public mockAllApi(): void {
    this.getKnowledgeBaseTagList();
    this.getKnowledgeBaseList();
    this.getKnowledgeGraph();
  }

  public getKnowledgeBaseTagList() {
    const spy = jest.spyOn(knowledge_base, 'getKnowledgeBaseTagList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockKnowledgeBaseTagListData
      })
    );
    return spy;
  }

  public getKnowledgeBaseList() {
    const spy = jest.spyOn(knowledge_base, 'getKnowledgeBaseList');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockKnowledgeBaseListData,
        total_nums: 30
      })
    );
    return spy;
  }

  public getKnowledgeGraph() {
    const spy = jest.spyOn(knowledge_base, 'getKnowledgeGraph');
    spy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockKnowledgeGraphData
      })
    );
    return spy;
  }
}

export default new KnowledgeBase();
