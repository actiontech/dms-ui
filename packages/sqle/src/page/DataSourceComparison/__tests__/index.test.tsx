import DataSourceComparison from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';
import {
  mockUseCurrentUser,
  mockUseDbServiceDriver,
  mockUseCurrentProject
} from '@actiontech/shared/lib/testUtil';

describe('DataSourceComparison', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should match snapshot', () => {
    const { container } = sqleSuperRender(<DataSourceComparison />);

    expect(container).toMatchSnapshot();
  });
});
