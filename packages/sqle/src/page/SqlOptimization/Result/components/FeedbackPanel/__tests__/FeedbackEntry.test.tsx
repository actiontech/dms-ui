import { fireEvent, screen, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import MockDate from 'mockdate';
import FeedbackEntry from '../FeedbackEntry';
import {
  OptimizedSQLFeedbackVoteEnum,
  OptimizedSQLFeedbackReqVoteEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IOptimizedSQLFeedback } from '@actiontech/shared/lib/api/sqle/service/common';

describe('FeedbackEntry', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const mockAgreeExistingFeedback: IOptimizedSQLFeedback = {
    id: 1,
    creator: 'admin',
    vote: OptimizedSQLFeedbackVoteEnum.agree,
    reason: '优化效果明显',
    created_at: '2024-04-17T03:33:09Z'
  };

  const mockDisagreeFeedback: IOptimizedSQLFeedback = {
    id: 2,
    creator: 'admin',
    vote: OptimizedSQLFeedbackVoteEnum.disagree,
    reason: '性能提升不明显',
    created_at: '2024-04-16T10:00:00Z'
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    MockDate.set('2024-04-17 12:00:00');
  });

  afterEach(() => {
    jest.useRealTimers();
    MockDate.reset();
    jest.clearAllMocks();
  });

  describe('INITIAL state', () => {
    it('should render vote buttons in initial state', () => {
      const { baseElement } = superRender(
        <FeedbackEntry onSubmit={mockOnSubmit} />
      );
      expect(baseElement).toMatchSnapshot();
    });

    it('should display agree and disagree vote buttons', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      expect(screen.getByText('通过')).toBeInTheDocument();
      expect(screen.getByText('不行')).toBeInTheDocument();
    });

    it('should not show reason area in initial state', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      expect(
        screen.queryByPlaceholderText('请输入备注（可选）')
      ).not.toBeInTheDocument();
    });
  });

  describe('EDITING state', () => {
    it('should enter editing state and show reason area when agree button is clicked', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('通过'));

      expect(
        screen.getByPlaceholderText('请输入备注（可选）')
      ).toBeInTheDocument();
      expect(screen.getByText('保 存')).toBeInTheDocument();
      expect(screen.getByText('取 消')).toBeInTheDocument();
    });

    it('should enter editing state when disagree button is clicked', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('不行'));

      expect(
        screen.getByPlaceholderText('请输入备注（可选）')
      ).toBeInTheDocument();
    });

    it('should render editing state snapshot', () => {
      const { baseElement } = superRender(
        <FeedbackEntry onSubmit={mockOnSubmit} />
      );

      fireEvent.click(screen.getByText('通过'));

      expect(baseElement).toMatchSnapshot();
    });

    it('should allow entering reason text', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('通过'));

      const textArea = screen.getByPlaceholderText('请输入备注（可选）');
      fireEvent.change(textArea, { target: { value: '优化效果很好' } });

      expect(textArea).toHaveValue('优化效果很好');
    });

    it('should call onSubmit with correct params when save button is clicked', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('通过'));

      const textArea = screen.getByPlaceholderText('请输入备注（可选）');
      fireEvent.change(textArea, { target: { value: '效果明显' } });

      fireEvent.click(screen.getByText('保 存'));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          vote: OptimizedSQLFeedbackReqVoteEnum.agree,
          reason: '效果明显'
        },
        undefined
      );
    });

    it('should call onSubmit with feedbackId when updating existing feedback', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const reEditBtn = document.querySelector('.re-edit-btn') as HTMLElement;
      fireEvent.click(reEditBtn);
      fireEvent.click(screen.getByText('保 存'));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          vote: OptimizedSQLFeedbackReqVoteEnum.agree
        }),
        '1'
      );
    });

    it('should call onSubmit without reason when reason is empty', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByText('通过'));
      fireEvent.click(screen.getByText('保 存'));

      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          vote: OptimizedSQLFeedbackReqVoteEnum.agree,
          reason: undefined
        },
        undefined
      );
    });

    it('should return to initial state when cancel is clicked without existing feedback', () => {
      superRender(
        <FeedbackEntry onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );

      fireEvent.click(screen.getByText('通过'));
      expect(screen.getByText('取 消')).toBeInTheDocument();

      fireEvent.click(screen.getByText('取 消'));

      expect(
        screen.queryByPlaceholderText('请输入备注（可选）')
      ).not.toBeInTheDocument();
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('should return to submitted state when cancel is clicked with existing feedback', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const reEditBtn = document.querySelector('.re-edit-btn') as HTMLElement;
      fireEvent.click(reEditBtn);
      expect(screen.getByText('取 消')).toBeInTheDocument();

      fireEvent.click(screen.getByText('取 消'));

      expect(
        screen.queryByPlaceholderText('请输入备注（可选）')
      ).not.toBeInTheDocument();
      expect(screen.getByText('通过')).toBeInTheDocument();
    });

    it('should show loading state on save button when submitting', () => {
      superRender(<FeedbackEntry onSubmit={mockOnSubmit} submitting={true} />);

      fireEvent.click(screen.getByText('通过'));

      const saveBtn = screen.getByText('保 存').closest('button');
      expect(saveBtn).toHaveClass('ant-btn-loading');
    });
  });

  describe('SUBMITTED state', () => {
    it('should render submitted view with agree vote', () => {
      const { baseElement } = superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );
      expect(baseElement).toMatchSnapshot();
    });

    it('should render submitted view with disagree vote', () => {
      const { baseElement } = superRender(
        <FeedbackEntry
          existingFeedback={mockDisagreeFeedback}
          onSubmit={mockOnSubmit}
        />
      );
      expect(baseElement).toMatchSnapshot();
    });

    it('should display vote label for agree feedback', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const voteLabelElements = screen.getAllByText('通过');
      expect(voteLabelElements.length).toBeGreaterThan(0);
    });

    it('should display vote label for disagree feedback', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockDisagreeFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('不行')).toBeInTheDocument();
    });

    it('should display reason when provided', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('优化效果明显')).toBeInTheDocument();
    });

    it('should not display reason section when reason is empty', () => {
      const feedbackWithoutReason: IOptimizedSQLFeedback = {
        id: 3,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      };

      superRender(
        <FeedbackEntry
          existingFeedback={feedbackWithoutReason}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.queryByText('优化效果明显')).not.toBeInTheDocument();
    });

    it('should have re-edit button in submitted view', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const reEditBtn = document.querySelector('.re-edit-btn');
      expect(reEditBtn).toBeInTheDocument();
    });

    it('should enter editing state when re-edit button is clicked', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const reEditBtn = document.querySelector('.re-edit-btn') as HTMLElement;
      fireEvent.click(reEditBtn);

      expect(
        screen.getByPlaceholderText('请输入备注（可选）')
      ).toBeInTheDocument();
    });

    it('should pre-fill reason text area with existing reason when re-editing', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const reEditBtn = document.querySelector('.re-edit-btn') as HTMLElement;
      fireEvent.click(reEditBtn);

      const textArea = screen.getByPlaceholderText('请输入备注（可选）');
      expect(textArea).toHaveValue('优化效果明显');
    });

    it('should display submitted-view container with agree class for agree vote', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockAgreeExistingFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const submittedView = document.querySelector('.submitted-view');
      expect(submittedView).toHaveClass('agree');
    });

    it('should display submitted-view container with disagree class for disagree vote', () => {
      superRender(
        <FeedbackEntry
          existingFeedback={mockDisagreeFeedback}
          onSubmit={mockOnSubmit}
        />
      );

      const submittedView = document.querySelector('.submitted-view');
      expect(submittedView).toHaveClass('disagree');
    });
  });
});
