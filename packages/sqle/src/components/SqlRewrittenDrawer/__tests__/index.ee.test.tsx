import { fireEvent, screen } from '@testing-library/dom';
import { sqleSuperRender } from '../../../testUtils/superRender';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import SqlRewrittenDrawerEE from '../index.ee';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { act, cleanup } from '@testing-library/react';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import {
  AsyncRewriteTaskStatusCompletedMockData,
  SqlRewrittenMockDataNoDDL
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import {
  RewriteSuggestionTypeEnum,
  AsyncRewriteTaskStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { removeSqlRewriteCache } from '../utils/sqlRewriteCache';

// Mock Modal.useModal
const mockModalConfirm = jest.fn();
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Modal: {
    ...jest.requireActual('antd').Modal,
    useModal: () => [
      {
        confirm: mockModalConfirm
      },
      <div key="modal-context" />
    ]
  }
}));

describe('SqlRewrittenDrawerEE Unit Tests', () => {
  const mockProps = {
    open: true,
    taskID: 'task-123',
    originSqlInfo: { number: 1, sql: 'SELECT * FROM table;' },
    width: 920,
    title: 'sql-rewrite',
    maskClosable: true,
    onClose: jest.fn()
  };

  let mockSqlRewrittenSpy: jest.SpyInstance;
  let mockAsyncRewriteTaskSpy: jest.SpyInstance;

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();

    mockSqlRewrittenSpy = task.getTaskSQLRewritten();
    mockAsyncRewriteTaskSpy = task.getAsyncRewriteTaskStatus();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
    removeSqlRewriteCache(mockProps.taskID, mockProps.originSqlInfo.number);
  });

  describe('when loading data', () => {
    it('should show loading indicator when fetching data', async () => {
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);

      expect(queryBySelector('.custom-loading-container')).toBeInTheDocument();

      await act(async () => jest.advanceTimersByTime(3000));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(1);
      expect(mockSqlRewrittenSpy).toHaveBeenCalledWith({
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: false
      });

      expect(
        queryBySelector('.custom-loading-container')
      ).not.toBeInTheDocument();
    });
  });

  describe('when data is fetched successfully', () => {
    it('should render overall rewrite suggestions section', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('整体重写建议')).toBeInTheDocument();
    });

    it('should render already rewritten rules section with correct count', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('已应用的规则')).toBeInTheDocument();
      expect(getBySelector('.optimized-count').textContent).toBe(
        AsyncRewriteTaskStatusCompletedMockData.result.suggestions
          ?.filter((v) => v.type === RewriteSuggestionTypeEnum.statement)
          .length.toString()
      );
    });

    it('should render pending rewrite rules section with button to toggle structure optimization', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.getByText('待应用的规则')).toBeInTheDocument();
      expect(getBySelector('.remaining-count').textContent).toBe(
        SqlRewrittenMockDataNoDDL.suggestions
          ?.filter((v) => v.type === RewriteSuggestionTypeEnum.structure)
          .length.toString()
      );
      expect(screen.getByText('启动数据库结构优化')).toBeInTheDocument();
    });

    it('should hide pending rewrite rules section when structure optimization is enabled', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      const button = screen.getByText('启动数据库结构优化');
      fireEvent.click(button);

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(2);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(2, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: true
      });

      expect(screen.queryByText('待应用的规则')).not.toBeInTheDocument();
      expect(screen.queryByText('启动数据库结构优化')).not.toBeInTheDocument();
    });

    it('should render business intervention required section with correct count', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      sqleSuperRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.getByText('待人工介入的规则')).toBeInTheDocument();
      expect(queryBySelector('.business-count')?.textContent).toBe(
        SqlRewrittenMockDataNoDDL.suggestions
          ?.filter((v) => v.type === RewriteSuggestionTypeEnum.other)
          .length.toString()
      );
    });

    it('should not call "RewriteSQL" when drawer reopens with cached data', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );

      const { rerender } = sqleSuperRender(
        <SqlRewrittenDrawerEE {...mockProps} />
      );

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(1);

      const button = screen.getByText('启动数据库结构优化');
      fireEvent.click(button);

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(2);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(2, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: true
      });

      rerender(<SqlRewrittenDrawerEE {...mockProps} open={false} />);

      rerender(<SqlRewrittenDrawerEE {...mockProps} />);

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(2);

      // 使用新的 SQL 信息打开抽屉
      const newMockProps = {
        ...mockProps,
        originSqlInfo: { ...mockProps.originSqlInfo, number: 2 }
      };
      rerender(<SqlRewrittenDrawerEE {...newMockProps} />);
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(3, {
        task_id: mockProps.taskID,
        number: 2,
        enable_structure_type: false
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.queryByText('待应用的规则')).toBeInTheDocument();
      expect(screen.queryByText('启动数据库结构优化')).toBeInTheDocument();

      rerender(<SqlRewrittenDrawerEE {...newMockProps} open={false} />);

      rerender(<SqlRewrittenDrawerEE {...newMockProps} />);

      await act(async () => jest.advanceTimersByTime(3000));

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
    });

    it('should call "RewriteSQL" when clicked update result button', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );

      const { rerender } = sqleSuperRender(
        <SqlRewrittenDrawerEE {...mockProps} />
      );

      expect(screen.queryByText('更新重写结果')).not.toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('更新重写结果')).toBeInTheDocument();

      fireEvent.click(screen.getByText('更新重写结果'));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(2);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(2, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: false
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      const button = screen.getByText('启动数据库结构优化');
      fireEvent.click(button);
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(3, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: true
      });

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      rerender(<SqlRewrittenDrawerEE {...mockProps} open={false} />);

      rerender(<SqlRewrittenDrawerEE {...mockProps} />);

      expect(screen.queryByText('更新重写结果')).toBeInTheDocument();
      fireEvent.click(screen.getByText('更新重写结果'));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(4);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(4, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: false
      });

      // 使用新的 SQL 信息打开抽屉
      const newMockProps = {
        ...mockProps,
        originSqlInfo: { ...mockProps.originSqlInfo, number: 2 }
      };
      rerender(<SqlRewrittenDrawerEE {...newMockProps} />);
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(4);

      expect(screen.queryByText('更新重写结果')).not.toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('更新重写结果')).toBeInTheDocument();
      fireEvent.click(screen.getByText('更新重写结果'));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(5);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(5, {
        task_id: mockProps.taskID,
        number: 2,
        enable_structure_type: false
      });
    });
  });

  describe('Drawer close confirmation', () => {
    it('should show confirmation modal when closing drawer during rewrite', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: {
            task_id: 'async-task-123',
            status: AsyncRewriteTaskStatusEnum.running
          }
        })
      );

      const localMockProps = { ...mockProps };
      sqleSuperRender(<SqlRewrittenDrawerEE {...localMockProps} />);

      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(getBySelector('.closed-icon-custom'));
      await act(async () => jest.advanceTimersByTime(300));

      expect(mockModalConfirm).toHaveBeenCalledWith({
        title: '重写任务正在进行中，关闭后任务将被终止。确认关闭吗？',
        onOk: expect.any(Function)
      });
    });

    it('should close drawer without confirmation when not rewriting', async () => {
      mockAsyncRewriteTaskSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: AsyncRewriteTaskStatusCompletedMockData
        })
      );
      const localMockProps = { ...mockProps };
      sqleSuperRender(<SqlRewrittenDrawerEE {...localMockProps} />);

      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      // 当没有重写任务运行时，直接触发关闭不应该调用模态框
      fireEvent.click(getBySelector('.closed-icon-custom'));
      await act(async () => jest.advanceTimersByTime(300));

      // 验证没有调用模态框确认
      expect(mockModalConfirm).not.toHaveBeenCalled();
      expect(localMockProps.onClose).toHaveBeenCalled();
    });
  });
});
