import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import LeftContent from '../LeftContent';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';

describe('LeftContent', () => {
  const mockProps = {
    optimizedSql: 'SELECT * FROM users WHERE id = 1',
    advisedIndex: 'CREATE INDEX idx_users_id ON users(id)',
    optimizedQueryPlan: [
      {
        operator: 'Table Scan',
        summary: ['Scanning users table'],
        children: []
      }
    ],
    errorMessage: undefined,
    onViewOverallDiff: jest.fn(),
    onViewTableStructure: jest.fn(),
    onViewQueryPlanDiff: jest.fn(),
    onExpandQueryPlan: jest.fn()
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockReactFlow();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with horizontal layout by default', () => {
    const { baseElement } = superRender(<LeftContent {...mockProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with vertical layout when isVerticalLayout is true', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} isVerticalLayout={true} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with horizontal layout when isVerticalLayout is false', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} isVerticalLayout={false} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with empty content', () => {
    const emptyProps = {
      ...mockProps,
      optimizedSql: undefined,
      advisedIndex: '',
      optimizedQueryPlan: undefined
    };
    const { baseElement } = superRender(<LeftContent {...emptyProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with error message', () => {
    const errorProps = {
      ...mockProps,
      errorMessage: 'Optimization failed'
    };
    const { baseElement } = superRender(<LeftContent {...errorProps} />);
    expect(baseElement).toMatchSnapshot();
  });
});
