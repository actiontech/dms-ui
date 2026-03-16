import { fireEvent, screen, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import MockDate from 'mockdate';
import FeedbackList from '../FeedbackList';
import { IOptimizedSQLFeedback } from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizedSQLFeedbackVoteEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { optimizedSQLFeedbacksMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';

describe('FeedbackList', () => {
  const mockOnDelete = jest.fn();

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

  it('should render no records message when feedbacks is empty', () => {
    const { baseElement } = superRender(
      <FeedbackList feedbacks={[]} onDelete={mockOnDelete} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无反馈记录')).toBeInTheDocument();
  });

  it('should render feedback list with mock data', () => {
    const { baseElement } = superRender(
      <FeedbackList
        feedbacks={optimizedSQLFeedbacksMockData}
        currentUsername="admin"
        onDelete={mockOnDelete}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should display creator name for each feedback', () => {
    superRender(
      <FeedbackList
        feedbacks={optimizedSQLFeedbacksMockData}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('should display vote badge with agree class for agree vote', () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(<FeedbackList feedbacks={feedbacks} onDelete={mockOnDelete} />);

    const voteBadge = document.querySelector('.vote-badge.agree');
    expect(voteBadge).toBeInTheDocument();
    expect(voteBadge).toHaveTextContent('通过');
  });

  it('should display vote badge with disagree class for disagree vote', () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'user1',
        vote: OptimizedSQLFeedbackVoteEnum.disagree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(<FeedbackList feedbacks={feedbacks} onDelete={mockOnDelete} />);

    const voteBadge = document.querySelector('.vote-badge.disagree');
    expect(voteBadge).toBeInTheDocument();
    expect(voteBadge).toHaveTextContent('不行');
  });

  it('should display reason text when provided', () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        reason: '优化效果明显',
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(<FeedbackList feedbacks={feedbacks} onDelete={mockOnDelete} />);

    expect(screen.getByText('优化效果明显')).toBeInTheDocument();
  });

  it('should not display reason section when reason is empty', () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(<FeedbackList feedbacks={feedbacks} onDelete={mockOnDelete} />);

    expect(document.querySelector('.feedback-reason')).not.toBeInTheDocument();
  });

  it('should show delete button only for current user own feedback', () => {
    superRender(
      <FeedbackList
        feedbacks={optimizedSQLFeedbacksMockData}
        currentUsername="admin"
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('删 除');
    expect(deleteButtons.length).toBe(1);
  });

  it('should not show delete button when currentUsername is not set', () => {
    superRender(
      <FeedbackList
        feedbacks={optimizedSQLFeedbacksMockData}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
  });

  it('should show delete confirmation popconfirm when delete button is clicked', async () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(
      <FeedbackList
        feedbacks={feedbacks}
        currentUsername="admin"
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('确认删除此条反馈？')).toBeInTheDocument();
  });

  it('should call onDelete with correct feedback id when confirmed', async () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 5,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(
      <FeedbackList
        feedbacks={feedbacks}
        currentUsername="admin"
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('确 认'));

    expect(mockOnDelete).toHaveBeenCalledWith('5');
  });

  it('should not call onDelete when cancel button is clicked in popconfirm', async () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 5,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(
      <FeedbackList
        feedbacks={feedbacks}
        currentUsername="admin"
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('取 消'));

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should sort feedbacks in descending order by created_at', () => {
    const unsortedFeedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'user_old',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-10T03:33:09Z'
      },
      {
        id: 2,
        creator: 'user_new',
        vote: OptimizedSQLFeedbackVoteEnum.disagree,
        created_at: '2024-04-20T03:33:09Z'
      }
    ];

    superRender(
      <FeedbackList feedbacks={unsortedFeedbacks} onDelete={mockOnDelete} />
    );

    const creatorNames = document.querySelectorAll('.creator-name');
    expect(creatorNames[0]).toHaveTextContent('user_new');
    expect(creatorNames[1]).toHaveTextContent('user_old');
  });

  it('should show loading state on delete button when deleteLoading is true', () => {
    const feedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 1,
        creator: 'admin',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T03:33:09Z'
      }
    ];

    superRender(
      <FeedbackList
        feedbacks={feedbacks}
        currentUsername="admin"
        deleteLoading={true}
        onDelete={mockOnDelete}
      />
    );

    const deleteBtn = screen.getByText('删 除').closest('button');
    expect(deleteBtn).toHaveClass('ant-btn-loading');
  });
});
