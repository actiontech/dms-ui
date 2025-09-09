import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import OptimizeSteps from '../OptimizeSteps';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { fireEvent, screen, act } from '@testing-library/react';

describe('OptimizeSteps', () => {
  const mockOptimizeSteps = [
    {
      rule_name: 'Index Optimization',
      rule_desc: 'Add index for better query performance',
      rule_id: 'rule_1',
      optimized_sql: 'SELECT * FROM users WHERE id = 1',
      chat_id: 'chat_1'
    },
    {
      rule_name: 'Query Rewrite',
      rule_desc: 'Rewrite query to use more efficient join conditions',
      rule_id: 'rule_2',
      optimized_sql:
        'SELECT u.* FROM users u INNER JOIN profiles p ON u.id = p.user_id',
      chat_id: 'chat_2'
    }
  ];

  const mockOnOptimizationRuleClick = jest.fn();

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with optimize steps', () => {
    const { baseElement } = superRender(
      <OptimizeSteps
        optimizeSteps={mockOptimizeSteps}
        onOptimizationRuleClick={mockOnOptimizationRuleClick}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render empty state when no steps provided', () => {
    const { baseElement } = superRender(
      <OptimizeSteps
        optimizeSteps={[]}
        onOptimizationRuleClick={mockOnOptimizationRuleClick}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render empty state with error message', () => {
    const { baseElement } = superRender(
      <OptimizeSteps
        optimizeSteps={[]}
        errorMessage="Failed to load optimization steps"
        onOptimizationRuleClick={mockOnOptimizationRuleClick}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should call onOptimizationRuleClick when step is clicked', async () => {
    superRender(
      <OptimizeSteps
        optimizeSteps={mockOptimizeSteps}
        onOptimizationRuleClick={mockOnOptimizationRuleClick}
      />
    );

    const firstStep = screen
      .getAllByText('Index Optimization')[0]
      .closest('.step-item');

    await act(async () => {
      fireEvent.click(firstStep!);
      jest.advanceTimersByTime(100);
    });

    expect(mockOnOptimizationRuleClick).toHaveBeenCalledWith(0);
  });
});
