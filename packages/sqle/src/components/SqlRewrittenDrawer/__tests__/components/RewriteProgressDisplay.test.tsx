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
  visible: true,
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
    it('should render null when visible is false', () => {
      const { container } = renderComponent({ visible: false });
      expect(container.firstChild).toBeNull();
    });

    it('should render rewrite failed UI when overallStatus is failed and errorMessage exists', () => {
      const errorMessage = 'Test error message';
      const { container } = renderComponent({
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage,
        visible: true
      });

      expect(screen.getByText('重写失败')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '重 试' })).toBeInTheDocument();

      expect(container).toMatchSnapshot();
    });

    it('should render progress container when visible is true and overallStatus is not failed', () => {
      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(container).toMatchSnapshot();
    });

    it('should render overall progress header with correct title and status', () => {
      renderComponent({
        visible: true,
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: rulesWithProgress
      });

      // Check progress bar fill width (should be 66%)
      const progressFill = getBySelector('.progress-fill');
      expect(progressFill).toHaveStyle('width: 66.67%');

      // Check progress text
      expect(screen.getByText(/66.67%/)).toBeInTheDocument();
      expect(screen.getByText(/2.*\/.*3.*个规则已处理/)).toBeInTheDocument();
    });

    it('should render rules list with all rule items', () => {
      renderComponent({
        visible: true,
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

  describe('Overall Status Display', () => {
    it('should display correct status text for pending status', () => {
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.pending
      });

      expect(screen.getByText('AI 正在思考中...')).toBeInTheDocument();
    });

    it('should display correct status text for running status', () => {
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      expect(
        screen.getByText('正在使用大模型生成结果，请稍候...')
      ).toBeInTheDocument();
    });

    it('should display correct status text for completed status', () => {
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed
      });

      expect(screen.getByText('更新重写结果')).toBeInTheDocument();
    });

    it('should display correct status text for failed status', () => {
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Test error' // Add error message to avoid failed UI rendering
      });

      expect(screen.getByText('重写失败')).toBeInTheDocument();
    });

    it('should show spinner when overall status is running', () => {
      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running
      });

      const spinner = getBySelector('.spinner', container);
      expect(spinner).toBeInTheDocument();
    });

    it('should apply correct CSS classes for different overall status', () => {
      // Test completed status class
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed
      });

      let statusText = getBySelector('.status-text');
      expect(statusText).toHaveClass('completed');

      cleanup();

      // Test default status (no special class)
      const { container: runningContainer } = renderComponent({
        visible: true,
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: mixedRules
      });

      const progressFill = getBySelector('.progress-fill', container);
      expect(progressFill).toHaveStyle(`width: ${floatToPercent(2 / 4)}%`);

      expect(
        screen.getByText(new RegExp(`${floatToPercent(2 / 4)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/2.*\/.*4.*个规则已处理/)).toBeInTheDocument();
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: pendingRules
      });

      const progressFill = getBySelector('.progress-fill', container);
      expect(progressFill).toHaveStyle(`width: ${floatToPercent(0 / 2)}%`);

      expect(
        screen.getByText(new RegExp(`${floatToPercent(0 / 2)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/0.*\/.*2.*个规则已处理/)).toBeInTheDocument();
    });

    it('should show 100% progress when all rules are completed', () => {
      const completedRules: IRuleProgressInfo[] = [
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
        }
      ];

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed,
        ruleProgressList: completedRules
      });

      const progressFill = getBySelector('.progress-fill', container);
      expect(progressFill).toHaveStyle(`width: ${floatToPercent(2 / 2)}%`);

      expect(
        screen.getByText(new RegExp(`${floatToPercent(2 / 2)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/2.*\/.*2.*个规则已处理/)).toBeInTheDocument();
    });

    it('should display correct progress text with completed rules count', () => {
      // Test with 1 out of 3 completed
      const partialRules: IRuleProgressInfo[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Completed Rule',
          ruleDescription: 'Description 1',
          status: RewriteSuggestionStatusEnum.processed
        },
        {
          ruleId: 'rule2',
          ruleName: 'Pending Rule 1',
          ruleDescription: 'Description 2',
          status: RewriteSuggestionStatusEnum.initial
        },
        {
          ruleId: 'rule3',
          ruleName: 'Pending Rule 2',
          ruleDescription: 'Description 3',
          status: RewriteSuggestionStatusEnum.initial
        }
      ];

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: partialRules
      });

      // Should show ~33.33% progress (1/3)
      expect(
        screen.getByText(new RegExp(`${floatToPercent(1 / 3)}%`))
      ).toBeInTheDocument();
      expect(screen.getByText(/1.*\/.*3.*个规则已处理/)).toBeInTheDocument();
    });
  });

  describe('Rule Status and Icons', () => {
    it('should display correct rule status text for processed rules', () => {
      const processedRule: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule',
        status: RewriteSuggestionStatusEnum.processed
      };

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRule]
      });

      expect(screen.getByText('已完成')).toBeInTheDocument();
    });

    it('should display correct rule status text for rules with mock progress', () => {
      // Test rule with initial status that would trigger mock progress
      const initialRule: IRuleProgressInfo = {
        ruleId: 'initial-rule',
        ruleName: 'Initial Rule',
        ruleDescription: 'A rule that will start processing',
        status: RewriteSuggestionStatusEnum.initial
      };

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [initialRule]
      });

      // Should initially show waiting text
      expect(screen.getByText('等待中')).toBeInTheDocument();

      // After timer triggers, it should show processing text
      act(() => {
        jest.advanceTimersByTime(1500); // Advance past initial delay
      });

      // The mock progress should have started, showing preparing text
      const preparingText = screen.queryByText(/准备处理规则：Initial Rule/);
      expect(preparingText).toBeInTheDocument();
    });

    it('should display correct rule status text for waiting rules', () => {
      const waitingRule: IRuleProgressInfo = {
        ruleId: 'waiting-rule',
        ruleName: 'Waiting Rule',
        ruleDescription: 'A rule that is waiting',
        status: RewriteSuggestionStatusEnum.initial
      };

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [waitingRule]
      });

      expect(screen.getByText('等待中')).toBeInTheDocument();
    });

    it('should display correct rule status text for rules with error', () => {
      const errorRule: IRuleProgressInfo = {
        ruleId: 'error-rule',
        ruleName: 'Error Rule',
        ruleDescription: 'A rule with error',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: 'Something went wrong'
      };

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [errorRule]
      });

      expect(
        screen.getByText(/错误.*Something went wrong/)
      ).toBeInTheDocument();
    });

    it('should show CheckCircleFilled icon for processed rules', () => {
      const processedRule: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule',
        status: RewriteSuggestionStatusEnum.processed
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRule]
      });

      const checkIconWrapper = getBySelector('.circular-progress', container);
      expect(checkIconWrapper).toMatchSnapshot();
    });

    it('should show CloseCircleFilled icon for rules with error', () => {
      const errorRule: IRuleProgressInfo = {
        ruleId: 'error-rule',
        ruleName: 'Error Rule',
        ruleDescription: 'A rule with error',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: 'Something went wrong'
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [errorRule]
      });

      const checkIconWrapper = getBySelector('.circular-progress', container);
      expect(checkIconWrapper).toMatchSnapshot();
    });

    it('should show ClockCircleOutlined icon for waiting rules', () => {
      const waitingRule: IRuleProgressInfo = {
        ruleId: 'waiting-rule',
        ruleName: 'Waiting Rule',
        ruleDescription: 'A rule that is waiting',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [waitingRule]
      });

      const checkIconWrapper = getBySelector('.circular-progress', container);
      expect(checkIconWrapper).toMatchSnapshot();
    });
  });

  describe('Rule Progress Calculation', () => {
    it('should return 100% progress for processed rules', () => {
      const processedRule: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule',
        status: RewriteSuggestionStatusEnum.processed
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRule]
      });

      // Check that the circular progress shows full completion (360deg)
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveStyle('--progress: 360deg');
    });

    it('should return 0% progress for rules without mock progress', () => {
      const initialRule: IRuleProgressInfo = {
        ruleId: 'initial-rule',
        ruleName: 'Initial Rule',
        ruleDescription: 'A rule that hasnt started processing',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [initialRule]
      });

      // Check that the circular progress shows 0% (0deg)
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveStyle('--progress: 0deg');
    });

    it('should calculate correct progress percentage based on mock progress', () => {
      const processingRule: IRuleProgressInfo = {
        ruleId: 'processing-rule',
        ruleName: 'Processing Rule',
        ruleDescription: 'A rule being processed',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processingRule]
      });

      // Start mock progress by advancing time
      act(() => {
        jest.advanceTimersByTime(1500); // Trigger initial delay
      });

      // Advance further to get some progress in the first step
      act(() => {
        jest.advanceTimersByTime(1000); // Some progress in preparing step
      });

      const circularProgress = getBySelector('.circular-progress', container);
      const progressStyle = circularProgress.getAttribute('style');

      // Should have some progress (not 0deg and not 360deg)
      expect(progressStyle).toMatch(/--progress:\s*\d+(\.\d+)?deg/);
      expect(progressStyle).not.toMatch(/--progress:\s*0deg/);
      expect(progressStyle).not.toMatch(/--progress:\s*360deg/);
    });

    it('should not exceed 95% progress for rules that are not completed', () => {
      const processingRule: IRuleProgressInfo = {
        ruleId: 'processing-rule',
        ruleName: 'Processing Rule',
        ruleDescription: 'A rule being processed',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processingRule]
      });

      // Start mock progress and advance through all steps
      act(() => {
        jest.advanceTimersByTime(1500); // Initial delay
      });

      // Advance through all mock progress steps
      act(() => {
        jest.advanceTimersByTime(50000); // Advance through all steps
      });

      const circularProgress = getBySelector('.circular-progress', container);
      const progressStyle = circularProgress.getAttribute('style');

      // Extract the degree value
      const progressMatch = progressStyle?.match(
        /--progress:\s*(\d+(?:\.\d+)?)deg/
      );
      const progressDegrees = progressMatch ? parseFloat(progressMatch[1]) : 0;

      // Should not exceed 95% (342deg = 95% of 360deg)
      expect(progressDegrees).toBeLessThanOrEqual(342);
      expect(progressDegrees).toBeGreaterThan(0);
    });
  });

  describe('Rule Item Status Styles', () => {
    it('should apply completed status class for processed rules', () => {
      const processedRule: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule',
        status: RewriteSuggestionStatusEnum.processed
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRule]
      });

      // Check that circular progress has completed class
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveClass('completed');

      // Check that status text wrapper has completed status
      const statusTextWrapper = screen.getByText('A completed rule');
      expect(statusTextWrapper).toBeInTheDocument();
    });

    it('should apply error status class for rules with error', () => {
      const errorRule: IRuleProgressInfo = {
        ruleId: 'error-rule',
        ruleName: 'Error Rule',
        ruleDescription: 'A rule with error',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: 'Something went wrong'
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [errorRule]
      });

      // Check that circular progress has error class
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveClass('error');

      // Check that status text wrapper has error status
      const statusTextWrapper = screen.getByText('A rule with error');
      expect(statusTextWrapper).toBeInTheDocument();
    });

    it('should apply processing status class for rules with mock progress', () => {
      const processingRule: IRuleProgressInfo = {
        ruleId: 'processing-rule',
        ruleName: 'Processing Rule',
        ruleDescription: 'A rule being processed',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processingRule]
      });

      // Advance timer to trigger mock progress
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Check that circular progress has processing class
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveClass('processing');
    });

    it('should apply waiting status class for rules without mock progress', () => {
      const waitingRule: IRuleProgressInfo = {
        ruleId: 'waiting-rule',
        ruleName: 'Waiting Rule',
        ruleDescription: 'A rule that is waiting',
        status: RewriteSuggestionStatusEnum.initial
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [waitingRule]
      });

      // Check that circular progress has waiting class (no specific class, default state)
      const circularProgress = getBySelector('.circular-progress', container);
      expect(circularProgress).toHaveClass('waiting');
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

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [initialRule]
      });

      // Initially should show waiting state
      expect(screen.getByText('等待中')).toBeInTheDocument();

      // Advance timer to trigger mock progress start
      act(() => {
        jest.advanceTimersByTime(1500); // Past initial delay
      });

      // Should now show preparing state (mock progress started)
      expect(
        screen.getByText(/准备处理规则：Initial Rule/)
      ).toBeInTheDocument();
    });

    it('should clear mock progress for processed rules', () => {
      const { rerender } = renderComponent({
        visible: true,
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

      // Verify mock progress is running
      expect(screen.getByText(/准备处理规则：Rule 1/)).toBeInTheDocument();

      // Update rule to processed status
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
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
      expect(
        screen.queryByText(/准备处理规则：Rule 1/)
      ).not.toBeInTheDocument();
    });

    it('should clear mock progress for rules with error', () => {
      const { rerender } = renderComponent({
        visible: true,
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

      // Verify mock progress is running
      expect(screen.getByText(/准备处理规则：Rule 1/)).toBeInTheDocument();

      // Update rule to have error
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'Error rule',
              status: RewriteSuggestionStatusEnum.initial,
              errorMessage: 'Processing failed'
            }
          ]}
        />
      );

      // Should now show error status
      expect(screen.getByText(/错误.*Processing failed/)).toBeInTheDocument();
    });

    it('should clear timers when component unmounts', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = renderComponent({
        visible: true,
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

    it('should clear timers for rules that no longer exist', () => {
      const { rerender } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [
          {
            ruleId: 'rule-1',
            ruleName: 'Rule 1',
            ruleDescription: 'Initial rule',
            status: RewriteSuggestionStatusEnum.initial
          },
          {
            ruleId: 'rule-2',
            ruleName: 'Rule 2',
            ruleDescription: 'Another rule',
            status: RewriteSuggestionStatusEnum.initial
          }
        ]
      });

      // Start mock progress for both rules
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Verify both rules are processing
      expect(screen.getByText(/准备处理规则：Rule 1/)).toBeInTheDocument();
      expect(screen.getByText(/准备处理规则：Rule 2/)).toBeInTheDocument();

      // Remove rule-2 from the list
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
          ruleProgressList={[
            {
              ruleId: 'rule-1',
              ruleName: 'Rule 1',
              ruleDescription: 'Initial rule',
              status: RewriteSuggestionStatusEnum.initial
            }
          ]}
        />
      );

      // Only rule-1 should remain, rule-2 should be cleaned up
      expect(screen.getByText(/准备处理规则：Rule 1/)).toBeInTheDocument();
      expect(
        screen.queryByText(/准备处理规则：Rule 2/)
      ).not.toBeInTheDocument();
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
        visible: true,
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithoutSql]
      });

      // Should not display rewritten SQL section
      expect(screen.queryByText('重写后SQL')).not.toBeInTheDocument();

      expect(
        queryBySelector('.rewritten-sql-display', container)
      ).not.toBeInTheDocument();
    });

    it('should not render rewritten SQL for non-processed rules', () => {
      const initialRuleWithSql: IRuleProgressInfo = {
        ruleId: 'initial-rule',
        ruleName: 'Initial Rule',
        ruleDescription: 'A non-processed rule with SQL',
        status: RewriteSuggestionStatusEnum.initial,
        rewrittenSql: 'SELECT * FROM users WHERE id = 1;'
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [initialRuleWithSql]
      });

      // Should not display rewritten SQL section even though SQL exists
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithSql]
      });

      // Should have CopyIcon component for the SQL
      const sqlActions = getBySelector('.sql-actions', container);
      expect(sqlActions).toBeInTheDocument();

      // CopyIcon should be present (it's imported from @actiontech/shared)
      expect(sqlActions.children.length).toBeGreaterThan(0);
    });

    it('should render SQL with SQLRenderer component', () => {
      const processedRuleWithSql: IRuleProgressInfo = {
        ruleId: 'processed-rule',
        ruleName: 'Processed Rule',
        ruleDescription: 'A completed rule with rewritten SQL',
        status: RewriteSuggestionStatusEnum.processed,
        rewrittenSql: 'SELECT * FROM users WHERE id = 1;'
      };

      const { container } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [processedRuleWithSql]
      });

      // The rewritten SQL container should contain the rendered SQL
      expect(
        getBySelector('.rewritten-sql-display', container)
      ).toMatchSnapshot();
    });
  });

  describe('Error Handling', () => {
    it('should display error message for rules with error', () => {
      const errorRule: IRuleProgressInfo = {
        ruleId: 'error-rule',
        ruleName: 'Error Rule',
        ruleDescription: 'A rule with error',
        status: RewriteSuggestionStatusEnum.initial,
        errorMessage: 'Something went wrong'
      };

      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        ruleProgressList: [errorRule]
      });

      expect(
        screen.getByText(/错误.*Something went wrong/)
      ).toBeInTheDocument();
    });

    it('should show retry button when overall status is failed', () => {
      renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'Task failed'
      });

      expect(screen.getByRole('button', { name: '重 试' })).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', () => {
      const mockOnRetry = jest.fn();

      renderComponent({
        visible: true,
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
        visible: true,
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        onComplete: mockOnComplete
      });

      expect(mockOnComplete).not.toHaveBeenCalled();

      // Change status to completed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.completed}
          onComplete={mockOnComplete}
        />
      );

      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onError when overall status becomes failed', () => {
      const mockOnError = jest.fn();

      const { rerender } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.running,
        onError: mockOnError
      });

      expect(mockOnError).not.toHaveBeenCalled();

      // Change status to failed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          onError={mockOnError}
        />
      );

      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith('错误');
    });

    it('should not call onComplete multiple times for same completion', () => {
      const mockOnComplete = jest.fn();

      const { rerender } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.completed,
        onComplete: mockOnComplete
      });

      expect(mockOnComplete).toHaveBeenCalledTimes(1);

      // Rerender with same completed status
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.completed}
          onComplete={mockOnComplete}
        />
      );

      // Should still only be called once
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('should not call onError multiple times for same error', () => {
      const mockOnError = jest.fn();

      const { rerender } = renderComponent({
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        onError: mockOnError
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);

      // Rerender with same failed status
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          onError={mockOnError}
        />
      );

      // Should still only be called once
      expect(mockOnError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Lifecycle and Cleanup', () => {
    it('should clean up all timers when component unmounts', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = renderComponent({
        visible: true,
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

      // Unmount component
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it('should clean up timers when overall status changes to completed', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderComponent({
        visible: true,
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
          visible={true}
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
        visible: true,
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
          visible={true}
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

    it('should clean up individual rule timers when rule status changes', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { rerender } = renderComponent({
        visible: true,
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

      // Change rule status to processed
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.running}
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
  });

  describe('Props Changes Response', () => {
    it('should update display when ruleProgressList changes', () => {
      const { rerender } = renderComponent({
        visible: true,
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
          visible={true}
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.pending
      });

      expect(screen.queryByText('AI 正在思考中...')).toBeInTheDocument();

      // Change status to running
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
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
        visible: true,
        overallStatus: AsyncRewriteTaskStatusEnum.failed,
        errorMessage: 'First error'
      });

      expect(screen.getByText(/First error/)).toBeInTheDocument();

      // Change error message
      rerender(
        <RewriteProgressDisplay
          {...defaultProps}
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          errorMessage="Second error"
        />
      );

      expect(screen.getByText(/Second error/)).toBeInTheDocument();
      expect(screen.queryByText(/First error/)).not.toBeInTheDocument();
    });

    it('should update display when isRetryLoading changes', () => {
      const { rerender } = renderComponent({
        visible: true,
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
          visible={true}
          overallStatus={AsyncRewriteTaskStatusEnum.failed}
          errorMessage="Task failed"
          isRetryLoading={true}
        />
      );

      expect(retryButton).toHaveClass('ant-btn-loading');
    });
  });
});
