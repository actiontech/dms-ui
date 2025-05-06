import { fireEvent, screen } from '@testing-library/dom';
import { superRender } from '../../../testUtils/customRender';
import task from '../../../testUtils/mockApi/task';
import SqlRewrittenDrawerEE from '../index.ee';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { act, render } from '@testing-library/react';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import {
  SqlRewrittenMockDataNoDDL,
  SqlRewrittenMockDataUseDDL
} from '../../../testUtils/mockApi/task/data';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import sharedTheme from '@actiontech/shared/lib/theme/light';
import lightTheme from '../../../theme/light';

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

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();

    mockSqlRewrittenSpy = task.getTaskSQLRewritten();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('when loading data', () => {
    it('should show loading indicator when fetching data', async () => {
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);

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
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('整体重写建议')).toBeInTheDocument();
    });

    it('should render already rewritten rules section with correct count', async () => {
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('已应用的规则')).toBeInTheDocument();
      expect(getBySelector('.optimized-count').textContent).toBe(
        SqlRewrittenMockDataNoDDL.suggestions
          ?.filter((v) => v.type === RewriteSuggestionTypeEnum.statement)
          .length.toString()
      );
    });

    it('should render pending rewrite rules section with button to toggle structure optimization', async () => {
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);
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
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);
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
      superRender(<SqlRewrittenDrawerEE {...mockProps} />);
      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.getByText('待人工介入的规则')).toBeInTheDocument();
      expect(queryBySelector('.business-count')?.textContent).toBe(
        SqlRewrittenMockDataNoDDL.suggestions
          ?.filter((v) => v.type === RewriteSuggestionTypeEnum.other)
          .length.toString()
      );
    });

    it('should not call "RewriteSQL" when drawer reopens with cached data', async () => {
      const themeData = {
        ...sharedTheme,
        ...lightTheme
      };

      const { rerender } = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

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

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} open={false} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(2);

      // 使用新的 SQL 信息打开抽屉
      const newMockProps = {
        ...mockProps,
        originSqlInfo: { ...mockProps.originSqlInfo, number: 2 }
      };
      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...newMockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(3, {
        task_id: mockProps.taskID,
        number: 2,
        enable_structure_type: false
      });

      await act(async () => jest.advanceTimersByTime(3000));

      expect(screen.queryByText('待应用的规则')).toBeInTheDocument();
      expect(screen.queryByText('启动数据库结构优化')).toBeInTheDocument();

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...newMockProps} open={false} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...newMockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      await act(async () => jest.advanceTimersByTime(3000));

      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
    });

    it('should call "RewriteSQL" when clicked update result button', async () => {
      const themeData = {
        ...sharedTheme,
        ...lightTheme
      };

      const { rerender } = render(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      expect(screen.queryByText('更新重写结果')).not.toBeInTheDocument();
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

      const button = screen.getByText('启动数据库结构优化');
      fireEvent.click(button);
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(3);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(3, {
        task_id: mockProps.taskID,
        number: mockProps.originSqlInfo.number,
        enable_structure_type: true
      });

      await act(async () => jest.advanceTimersByTime(3000));

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} open={false} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...mockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );

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
      rerender(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themeData}>
            <SqlRewrittenDrawerEE {...newMockProps} />
          </ThemeProvider>
        </StyledEngineProvider>
      );
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(5);

      expect(screen.queryByText('更新重写结果')).not.toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('更新重写结果')).toBeInTheDocument();
      fireEvent.click(screen.getByText('更新重写结果'));
      expect(mockSqlRewrittenSpy).toHaveBeenCalledTimes(6);
      expect(mockSqlRewrittenSpy).toHaveBeenNthCalledWith(6, {
        task_id: mockProps.taskID,
        number: 2,
        enable_structure_type: false
      });
    });
  });
});
