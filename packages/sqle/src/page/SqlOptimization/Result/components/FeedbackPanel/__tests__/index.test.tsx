import { act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import MockDate from 'mockdate';
import sqlOptimization from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization';
import { optimizedSQLFeedbacksMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlOptimization/data';
import FeedbackPanel from '../index';
import { IOptimizedSQLFeedback } from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizedSQLFeedbackVoteEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('FeedbackPanel', () => {
  let addFeedbackSpy: jest.SpyInstance;
  let deleteFeedbackSpy: jest.SpyInstance;
  let updateFeedbackSpy: jest.SpyInstance;

  const mockProps = {
    optimizationRecordId: 'record-001',
    initialFeedbacks: optimizedSQLFeedbacksMockData,
    onFeedbackChanged: jest.fn()
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    sqlOptimization.mockAllApi();
    addFeedbackSpy = sqlOptimization.addOptimizedSQLFeedback();
    deleteFeedbackSpy = sqlOptimization.deleteOptimizedSQLFeedback();
    updateFeedbackSpy = sqlOptimization.updateOptimizedSQLFeedback();
    jest.useFakeTimers();
    MockDate.set('2024-04-17 12:00:00');
  });

  afterEach(() => {
    jest.useRealTimers();
    MockDate.reset();
    jest.clearAllMocks();
  });

  it('should render feedback panel correctly with initial feedbacks', () => {
    const { baseElement } = superRender(<FeedbackPanel {...mockProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render feedback panel with empty feedbacks', () => {
    const { baseElement } = superRender(
      <FeedbackPanel
        optimizationRecordId="record-001"
        initialFeedbacks={[]}
        onFeedbackChanged={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无反馈记录')).toBeInTheDocument();
  });

  it('should display section title', () => {
    superRender(<FeedbackPanel {...mockProps} />);
    expect(screen.getByText('评估反馈')).toBeInTheDocument();
  });

  it('should display review records title', () => {
    superRender(<FeedbackPanel {...mockProps} />);
    expect(screen.getByText('会审记录')).toBeInTheDocument();
  });

  it('should show submitted view for current user own feedback', () => {
    superRender(<FeedbackPanel {...mockProps} />);

    const submittedView = document.querySelector('.submitted-view');
    expect(submittedView).toBeInTheDocument();
    expect(submittedView).toHaveClass('agree');
  });

  it('should show vote buttons when current user has no feedback', () => {
    const feedbacksWithoutAdmin: IOptimizedSQLFeedback[] = [
      {
        id: 2,
        creator: 'user1',
        vote: OptimizedSQLFeedbackVoteEnum.disagree,
        created_at: '2024-04-16T10:00:00Z'
      }
    ];

    superRender(
      <FeedbackPanel
        optimizationRecordId="record-001"
        initialFeedbacks={feedbacksWithoutAdmin}
      />
    );

    expect(document.querySelector('.vote-buttons')).toBeInTheDocument();
    expect(document.querySelector('.submitted-view')).not.toBeInTheDocument();
  });

  it('should call addFeedback API when submitting new feedback', async () => {
    const onFeedbackChanged = jest.fn();

    superRender(
      <FeedbackPanel
        optimizationRecordId="record-001"
        initialFeedbacks={[]}
        onFeedbackChanged={onFeedbackChanged}
      />
    );

    fireEvent.click(screen.getByText('通过'));
    fireEvent.click(screen.getByText('保 存'));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(addFeedbackSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        project_name: 'default',
        optimization_record_id: 'record-001'
      })
    );
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should call updateFeedback API when re-editing existing feedback', async () => {
    const onFeedbackChanged = jest.fn();

    superRender(
      <FeedbackPanel {...mockProps} onFeedbackChanged={onFeedbackChanged} />
    );

    const reEditBtn = document.querySelector('.re-edit-btn') as HTMLElement;
    fireEvent.click(reEditBtn);

    fireEvent.click(screen.getByText('保 存'));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateFeedbackSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        project_name: 'default',
        optimization_record_id: 'record-001',
        feedback_id: '1'
      })
    );
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should call deleteFeedback API and trigger onFeedbackChanged when deleting feedback', async () => {
    const onFeedbackChanged = jest.fn();

    superRender(
      <FeedbackPanel {...mockProps} onFeedbackChanged={onFeedbackChanged} />
    );

    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('确 认'));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(deleteFeedbackSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        project_name: 'default',
        optimization_record_id: 'record-001',
        feedback_id: '1'
      })
    );
    expect(onFeedbackChanged).toHaveBeenCalledTimes(1);
  });

  it('should update local feedbacks when initialFeedbacks prop changes', () => {
    const { rerender } = superRender(<FeedbackPanel {...mockProps} />);

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();

    const updatedFeedbacks: IOptimizedSQLFeedback[] = [
      {
        id: 99,
        creator: 'new_user',
        vote: OptimizedSQLFeedbackVoteEnum.agree,
        created_at: '2024-04-17T10:00:00Z'
      }
    ];

    rerender(
      <FeedbackPanel
        optimizationRecordId="record-001"
        initialFeedbacks={updatedFeedbacks}
        onFeedbackChanged={jest.fn()}
      />
    );

    expect(screen.getByText('new_user')).toBeInTheDocument();
  });

  it('should display delete button only for current user feedback in the feedback list', () => {
    superRender(<FeedbackPanel {...mockProps} />);

    const deleteButtons = screen.getAllByText('删 除');
    expect(deleteButtons.length).toBe(1);
  });

  it('should render without onFeedbackChanged prop', () => {
    const { baseElement } = superRender(
      <FeedbackPanel optimizationRecordId="record-001" initialFeedbacks={[]} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
