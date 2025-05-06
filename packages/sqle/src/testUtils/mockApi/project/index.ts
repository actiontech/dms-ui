import Project from '@actiontech/shared/lib/api/base/service/Project';
import {
  MockSpyApy,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockEnvironmentTagsData } from './data';

class MockProjectApi implements MockSpyApy {
  public mockAllApi(): void {
    this.listEnvironmentTags();
  }

  public listEnvironmentTags() {
    const spy = jest.spyOn(Project, 'ListEnvironmentTags');
    spy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockEnvironmentTagsData })
    );
    return spy;
  }
}

export default new MockProjectApi();
