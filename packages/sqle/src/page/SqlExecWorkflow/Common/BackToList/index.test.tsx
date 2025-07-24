import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import BackToList from '.';
import { sqleSuperRender } from '../../../../testUtils/superRender';

describe('test BackToList', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render snapshot when isAuditing is truthy', () => {
    expect(sqleSuperRender(<BackToList isAuditing />)).toMatchSnapshot();
  });

  it('render snapshot when isAuditing is falsy', () => {
    expect(
      sqleSuperRender(<BackToList isAuditing={false} />)
    ).toMatchSnapshot();
  });
});
