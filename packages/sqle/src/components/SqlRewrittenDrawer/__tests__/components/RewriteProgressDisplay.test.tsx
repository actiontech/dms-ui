import { screen, fireEvent, act, cleanup } from '@testing-library/react';
import {
  AsyncRewriteTaskStatusEnum,
  RewriteSuggestionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import RewriteProgressDisplay from '../../components/RewriteProgressDisplay/index';
import {
  IRewriteProgressDisplayProps,
  IRuleProgressInfo
} from '../../components/RewriteProgressDisplay/index.type';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil';

const mockRuleProgressList: IRuleProgressInfo[] = [
  {
    ruleId: 'rule1',
    ruleName: 'Test Rule 1',
    ruleDescription: 'Description for test rule 1',
    status: RewriteSuggestionStatusEnum.processed,
    rewrittenSql: 'SELECT * FROM table1;'
  },
  {
    ruleId: 'rule2',
    ruleName: 'Test Rule 2',
    ruleDescription: 'Description for test rule 2',
    status: RewriteSuggestionStatusEnum.initial
  },
  {
    ruleId: 'rule3',
    ruleName: 'Test Rule 3',
    ruleDescription: 'Description for test rule 3',
    status: RewriteSuggestionStatusEnum.processed,
    errorMessage: 'Test error message'
  }
];

const defaultProps: IRewriteProgressDisplayProps = {
  isProgressActive: true,
  overallStatus: AsyncRewriteTaskStatusEnum.running,
  ruleProgressList: mockRuleProgressList,
  errorMessage: undefined,
  onComplete: jest.fn(),
  onError: jest.fn(),
  onRetry: jest.fn(),
  isRetryLoading: false
};

// Setup function to render component with default props
const renderComponent = (props: Partial<IRewriteProgressDisplayProps> = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return sqleSuperRender(<RewriteProgressDisplay {...mergedProps} />);
};

describe('RewriteProgressDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Component Rendering', () => {
    it('should render compact progress when isProgressActive is false', () => {
      const { container } = renderComponent({ isProgressActive: false });
      expect(
        container.querySelector('.compact-progress-bar')
      ).toBeInTheDocument();
    });

    it('should render rewrite failed UI when overallStatus is failed and errorMessage exists', () => {
      const errorMessage = 'Test error message';
      const { container } = renderComponent({
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage,
        isProgressActive: true
      });

      expect(screen.getByText('重写失败')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '重 试' })).toBeInTheDocument();

      expect(container).toMatchSnapshot();
    });

    it('should render progress container when isProgressActive is true and overallStatus is not failed', () => {
      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(container).toMatchSnapshot();
    });

    it('should render overall progress header with correct title and status', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(screen.getByText('SQL重写进度')).toBeInTheDocument();
      expect(
        screen.getByText('正在使用大模型生成结果，请稍候...')
      ).toBeInTheDocument();
    });

    it('should render overall progress bar with correct percentage', () => {
      // Create rules with 2 out of 3 completed (66.67%)
      const rulesWithProgress: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Test Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Test Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule3',
          ruleName: 'Test Rule 3',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: rulesWithProgress
      });

      // Check progress bar fill width (should be 66%)
      const progressFill = getBySelector('.progress-fill');
      expect(progressFill).toHaveStyle('width: 66.67%');

      // Check progress text
      expect(screen.getByText(/66.67%/)).toBeInTheDocument();
      expect(screen.getByText(/2.*\/.*3.*条规则/)).toBeInTheDocument();
    });

    it('should render rules list with all rule items', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: mockRuleProgressList
      });

      // Check that all rules are rendered
      expect(screen.getByText('Test Rule 1')).toBeInTheDocument();
      expect(screen.getByText('Test Rule 2')).toBeInTheDocument();
      expect(screen.getByText('Test Rule 3')).toBeInTheDocument();

      // Check rule descriptions
      expect(
        screen.getByText('Description for test rule 1')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Description for test rule 2')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Description for test rule 3')
      ).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse Functionality', () => {
    it('should render expanded view when isProgressActive is true', () => {
      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(screen.getByText('SQL重写进度')).toBeInTheDocument();
      expect(
        container.querySelector('.overall-progress-bar')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.compact-progress-bar')
      ).not.toBeInTheDocument();
    });

    it('should render compact view when isProgressActive is false', () => {
      const { container } = renderComponent({
        isProgressActive: false,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(
        container.querySelector('.compact-progress-bar')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.overall-progress-bar')
      ).not.toBeInTheDocument();
    });

    it('should toggle between expanded and compact views when toggle button is clicked', () => {
      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      // Initially expanded
      expect(
        container.querySelector('.overall-progress-bar')
      ).toBeInTheDocument();

      // Click collapse button
      const toggleButton = container.querySelector('.progress-toggle-button');
      fireEvent.click(toggleButton!);

      // Should now be compact
      expect(
        container.querySelector('.compact-progress-bar')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.overall-progress-bar')
      ).not.toBeInTheDocument();

      // Click expand button
      const expandButton = container.querySelector('.progress-toggle-button');
      fireEvent.click(expandButton!);

      // Should be expanded again
      expect(
        container.querySelector('.overall-progress-bar')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.compact-progress-bar')
      ).not.toBeInTheDocument();
    });
  });

  describe('Overall Status Display', () => {
    it('should display correct status text for pending status', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.pending
      });

      expect(screen.getByText('AI 正在思考中...')).toBeInTheDocument();
    });

    it('should display correct status text for running status', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(
        screen.getByText('正在使用大模型生成结果，请稍候...')
      ).toBeInTheDocument();
    });

    it('should display correct status text for completed status', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed
      });

      expect(screen.queryByText('重写完成')).not.toBeInTheDocument();

      fireEvent.click(getBySelector('.progress-toggle-button'));

      expect(screen.getByText('重写完成')).toBeInTheDocument();
    });

    it('should display correct status text for failed status', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Test error' // Add error message to avoid failed UI rendering
      });

      expect(screen.getByText('重写失败')).toBeInTheDocument();
    });

    it('should show spinner when overall status is running', () => {
      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      const spinner = getBySelector('.spinner', container);
      expect(spinner).toBeInTheDocument();
    });

    it('should apply correct CSS classes for different overall status', () => {
      // Test completed status class
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed
      });

      fireEvent.click(getBySelector('.progress-toggle-button'));

      let statusText = getBySelector('.status-text');
      expect(statusText).toHaveClass('completed');

      cleanup();

      // Test default status (no special class)
      const { container: runningContainer } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      statusText = getBySelector('.status-text', runningContainer);
      expect(statusText).not.toHaveClass('completed');
    });
  });

  describe('Overall Progress Calculation', () => {
    it('should calculate overall progress percentage correctly based on completed rules', () => {
      // Create rules with mixed status: 2 completed out of 4 total (50%)
      const mixedRules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Completed Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Completed Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule3',
          ruleName: 'Pending Rule 1',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.initial
        },
        {
          ruleId: 'rule4',
          ruleName: 'Pending Rule 2',
          ruleDescription: 'Description 4',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: mixedRules
      });

      const progressFill = getBySelector('.progress-fill', container);
      expect(progressFill).toHaveStyle(`width: ${floatToPercent(2 / 4)}%`);

      expect(
        screen.getByText(new RegExp(`${floatToPercent(2 / 4)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/2.*\/.*4.*条规则/)).toBeInTheDocument();
    });

    it('should show 0% progress when no rules are completed', () => {
      const pendingRules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Pending Rule 1',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.initial
        },
        {
          ruleId: 'rule2',
          ruleName: 'Pending Rule 2',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: pendingRules
      });

      const progressFill = getBySelector('.progress-fill', container);
      expect(progressFill).toHaveStyle(`width: ${floatToPercent(0 / 2)}%`);

      expect(
        screen.getByText(new RegExp(`${floatToPercent(0 / 2)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/0.*\/.*2.*条规则/)).toBeInTheDocument();
    });
  });

  describe('Rule Status and Progress', () => {
    it('should display correct rule status text for processed rules', () => {
      const processedRule: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule',
        status: RewriteSuggestionStatusEnum.processed
      };

      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRule]
      });

      expect(screen.getByText('已完成')).toBeInTheDocument();
    });

    it('should display correct rule status text for waiting rules', () => {
      const waitingRule: IRuleProgressInfo = {
        ruleId: 'waiting-rule',
        ruleName: 'Waiting Rule',
        ruleDescription: 'A rule that is waiting',
        status: RewriteSuggestionStatusEnum.initial
      };

      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [waitingRule]
      });

      expect(screen.getByText('等待中...')).toBeInTheDocument();
    });

    it('should show wave progress animation for processing rules', () => {
      const processingRule: IRuleProgressInfo = {
        ruleId: 'processing-rule',
        ruleName: 'Processing Rule',
        ruleDescription: 'A rule being processed',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processingRule]
      });

      // Check for wave progress container
      const waveProgress = container.querySelector('.wave-progress');
      expect(waveProgress).toBeInTheDocument();

      // Check for wave elements
      expect(container.querySelector('.wave1')).toBeInTheDocument();
      expect(container.querySelector('.wave2')).toBeInTheDocument();
      expect(container.querySelector('.wave3')).toBeInTheDocument();
    });
  });

  describe('Mock Progress Management', () => {
    it('should start mock progress for rules with initial status', () => {
      const initialRule: IRuleProgressInfo = {
        ruleId: 'initial-rule',
        ruleName: 'Initial Rule',
        ruleDescription: 'A rule that will start processing',
        status: RewriteSuggestionStatusEnum.initial
      };

      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [initialRule]
      });

      // Initially should show waiting state
      expect(screen.getByText('等待中...')).toBeInTheDocument();

      // Advance timer to trigger mock progress start
      act(() => {
        jest.advanceTimersByTime(30000); // Past initial delay
      });

      // Should now show processing state (mock progress started)
      expect(
        screen.getByText(
          /准备处理规则|应用规则|模型评估|分析与其他规则关系|应用重写|验证结果/
        )
      ).toBeInTheDocument();
    });

    it('should clear mock progress for processed rules', () => {
      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'Initial rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      // Start mock progress
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Update rule to processed status
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'Completed rule',
              status: RewriteSuggestionStatusEnum.processed
            }
          ]}
        />
      );

      // Should now show completed status
      expect(screen.getByText('已完成')).toBeInTheDocument();
    });

    it('should clear timers when component unmounts', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'Initial rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      // Start mock progress to create timers
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Unmount component
      unmount();

      // Should have called clearTimeout (component cleanup)
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Rewritten SQL Display', () => {
    it('should render rewritten SQL for processed rules with rewritten SQL', () => {
      const processedRuleWithSql: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule with rewritten SQL',
        status: RewriteSuggestionStatusEnum.processed,
        rewrittenSql: 'SELECT * FROM users WHERE id = 1;'
      };

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithSql]
      });

      // Should display rewritten SQL header
      expect(screen.getByText('重写后SQL')).toBeInTheDocument();

      expect(
        getBySelector('.rewritten-sql-display', container)
      ).toMatchSnapshot();
    });

    it('should not render rewritten SQL for rules without rewritten SQL', () => {
      const processedRuleWithoutSql: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule without rewritten SQL',
        status: RewriteSuggestionStatusEnum.processed
        // No rewrittenSql property
      };

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithoutSql]
      });

      // Should not display rewritten SQL section
      expect(screen.queryByText('重写后SQL')).not.toBeInTheDocument();

      expect(
        queryBySelector('.rewritten-sql-display', container)
      ).not.toBeInTheDocument();
    });

    it('should display copy button for rewritten SQL', () => {
      const processedRuleWithSql: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule with rewritten SQL',
        status: RewriteSuggestionStatusEnum.processed,
        rewrittenSql: 'SELECT * FROM users WHERE id = 1;'
      };

      const { container } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithSql]
      });

      // Should have CopyIcon component for the SQL
      const sqlActions = getBySelector('.sql-actions', container);
      expect(sqlActions).toBeInTheDocument();

      // CopyIcon should be present
      expect(sqlActions.children.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should show retry button when overall status is failed', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Task failed'
      });

      expect(screen.getByRole('button', { name: '重 试' })).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const mockOnRetry = jest.fn();

      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Task failed',
        onRetry: mockOnRetry
      });

      const retryButton = screen.getByRole('button', { name: '重 试' });
      fireEvent.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('should show loading state on retry button when isRetryLoading is true', () => {
      renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Task failed',
        isRetryLoading: true
      });

      const retryButton = screen.getByText('重 试').closest('button');
      expect(retryButton).toHaveClass('ant-btn-loading');
    });
  });

  describe('Callback Functions', () => {
    it('should call onComplete when overall status becomes completed', () => {
      const mockOnComplete = jest.fn();

      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        onComplete: mockOnComplete
      });

      expect(mockOnComplete).not.toHaveBeenCalled();

      // Change status to completed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.completed}
          onComplete={mockOnComplete}
        />
      );

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onError when overall status becomes failed', () => {
      const mockOnError = jest.fn();

      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        onError: mockOnError
      });

      expect(mockOnError).not.toHaveBeenCalled();

      // Change status to failed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          onError={mockOnError}
        />
      );

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith('处理失败');
    });

    it('should auto collapse when task completes', () => {
      const { container, rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      // Initially expanded
      expect(
        container.querySelector('.overall-progress-bar')
      ).toBeInTheDocument();

      // Change status to completed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.completed}
        />
      );

      // Should auto collapse
      expect(
        container.querySelector('.compact-progress-bar')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.overall-progress-bar')
      ).not.toBeInTheDocument();
    });
  });

  describe('Lifecycle and Cleanup', () => {
    it('should clean up timers when overall status changes to completed', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'First rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      // Start mock progress
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      clearTimeoutSpy.mockClear();

      // Change status to completed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.completed}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'First rule',
              status: RewriteSuggestionStatusEnum.processed
            }
          ]}
        />
      );

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should clean up timers when overall status changes to failed', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'First rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      // Start mock progress
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      clearTimeoutSpy.mockClear();

      // Change status to failed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'First rule',
              status: RewriteSuggestionStatusEnum.initial,
              errorMessage: 'Failed'
            }
          ]}
        />
      );

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Props Changes Response', () => {
    it('should update display when ruleProgressList changes', () => {
      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'First rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      expect(screen.getByText('First rule')).toBeInTheDocument();
      expect(screen.queryByText('Second rule')).not.toBeInTheDocument();

      // Update rule list
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'First rule',
              status: RewriteSuggestionStatusEnum.initial
            },
            {
              ruleId: 'rule-2',
              ruleName: 'Rule 2',
              ruleDescription: 'Second rule',
              status: RewriteSuggestionStatusEnum.initial
            }
          ]}
        />
      );

      expect(screen.getByText('First rule')).toBeInTheDocument();
      expect(screen.getByText('Second rule')).toBeInTheDocument();
    });

    it('should update display when overallStatus changes', () => {
      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.pending
      });

      expect(screen.queryByText('AI 正在思考中...')).toBeInTheDocument();

      // Change status to running
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
        />
      );

      expect(
        screen.queryByText('正在使用大模型生成结果，请稍候...')
      ).toBeInTheDocument();
      expect(screen.queryByText('AI 正在思考中...')).not.toBeInTheDocument();
    });

    it('should update display when errorMessage changes', () => {
      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'First error'
      });

      expect(screen.getByText(/First error/)).toBeInTheDocument();

      // Change error message
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          errorMessage="Second error"
        />
      );

      expect(screen.getByText(/Second error/)).toBeInTheDocument();
      expect(screen.queryByText(/First error/)).not.toBeInTheDocument();
    });

    it('should update display when isRetryLoading changes', () => {
      const { rerender } = renderComponent({
        isProgressActive: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Task failed',
        isRetryLoading: false
      });

      const retryButton = screen.getByText('重 试').closest('button');
      expect(retryButton).not.toHaveClass('ant-btn-loading');

      // Change to loading state
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          isProgressActive={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          errorMessage="Task failed"
          isRetryLoading={true}
        />
      );

      expect(retryButton).toHaveClass('ant-btn-loading');
    });
  });
});
