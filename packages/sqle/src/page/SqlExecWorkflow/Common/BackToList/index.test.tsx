import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import BackToList from '.';
import { superRender } from '../../../../testUtils/customRender';

describe('test BackToList', () => {
  beforeEach(() => {
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('render snapshot when isAuditing is truthy', () => {
    expect(superRender(<BackToList isAuditing />)).toMatchSnapshot();
  });

  it('render snapshot when isAuditing is falsy', () => {
    expect(superRender(<BackToList isAuditing={false} />)).toMatchSnapshot();
  });
});
