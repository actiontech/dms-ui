import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlDiffView from '../SqlDiffView';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';

describe('SqlDiffView', () => {
  const mockProps = {
    originalSql: 'SELECT * FROM users',
    optimizedSql: 'SELECT id, name FROM users WHERE active = 1'
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with custom titles', () => {
    const { baseElement } = superRender(
      <SqlDiffView
        {...mockProps}
        originTitle="Original Query"
        optimizedTitle="Optimized Query"
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with empty SQL strings', () => {
    const { baseElement } = superRender(
      <SqlDiffView originalSql="" optimizedSql="" />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with different length SQLs', () => {
    const shortSql = 'SELECT id FROM users';
    const longSql = `SELECT u.id,
       u.name,
       u.email,
       u.created_at,
       u.updated_at
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.active = 1
  AND u.verified = 1
ORDER BY u.created_at DESC
LIMIT 100`;

    const { baseElement } = superRender(
      <SqlDiffView originalSql={shortSql} optimizedSql={longSql} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
