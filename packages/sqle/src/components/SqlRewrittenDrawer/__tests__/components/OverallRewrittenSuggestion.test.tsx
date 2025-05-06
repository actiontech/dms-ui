import { fireEvent, screen } from '@testing-library/dom';
import { superRender } from '../../../../testUtils/customRender';
import OverallRewrittenSuggestion from '../../components/OverallRewrittenSuggestion';
import {
  SqlRewrittenMockDataNoDDL,
  SqlRewrittenMockDataUseDDL,
  SqlRewrittenMockDataWithLogic
} from '../../../../testUtils/mockApi/task/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { Copy } from '@actiontech/shared';

describe('OverallRewrittenSuggestion', () => {
  const mockProps = {
    originalSql: 'SELECT * FROM table;',
    rewrittenSql: SqlRewrittenMockDataNoDDL.rewritten_sql,
    businessNonEquivalentDesc:
      SqlRewrittenMockDataNoDDL.business_non_equivalent_desc,
    suggestions: SqlRewrittenMockDataNoDDL.suggestions!,
    optimizedCount: 9,
    remainingCount: 2,
    businessCount: 0,
    businessDesc: SqlRewrittenMockDataNoDDL.business_desc!,
    sqlLogicDesc: SqlRewrittenMockDataWithLogic.logic_desc!,
    rewrittenSqlLogicDesc:
      SqlRewrittenMockDataWithLogic.rewritten_sql_logic_desc!
  };

  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  beforeEach(() => {
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render summary section with correct information', () => {
    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    expect(screen.getByText('总结')).toBeInTheDocument();
    expect(
      screen.getByText(
        `本次 SQL 重写基于 ${mockProps.optimizedCount} 条规则进行了优化，目前还有 ${mockProps.remainingCount} 条规则有待进一步优化。此外，有 ${mockProps.businessCount} 条规则需要人工处理。`
      )
    ).toBeInTheDocument();
    expect(screen.getByText(mockProps.businessDesc)).toBeInTheDocument();
  });

  it('should render database structure change statement section when overallDDL exists', () => {
    superRender(
      <OverallRewrittenSuggestion
        {...mockProps}
        suggestions={SqlRewrittenMockDataUseDDL.suggestions!}
      />
    );

    expect(screen.getByText('数据库结构变更语句')).toBeInTheDocument();
  });

  it('should not render database structure change statement section when overallDDL is not exists', () => {
    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    expect(screen.queryByText('数据库结构变更语句')).not.toBeInTheDocument();
  });

  it('should render sql rewrite result section when rewrittenSql exists', () => {
    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    expect(screen.getByText('SQL重写结果')).toBeInTheDocument();
    expect(screen.getByText('复制重写后SQL')).toBeInTheDocument();
    expect(screen.getByText('查看差异')).toBeInTheDocument();
    expect(
      queryBySelector('.actiontech-diff-sql-view-only-editor-renderer-wrapper')
    ).toBeInTheDocument();
    expect(
      queryBySelector('.actiontech-sql-view-only-editor-renderer-wrapper')
    ).not.toBeInTheDocument();
  });

  it('should toggle SQL difference view on button click', () => {
    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    const diffToggle = screen.getByText('查看差异');
    fireEvent.click(diffToggle);

    expect(
      queryBySelector('.actiontech-sql-view-only-editor-renderer-wrapper')
    ).toBeInTheDocument();
  });

  it('should render execution order explanation section', () => {
    const { container } = superRender(
      <OverallRewrittenSuggestion {...mockProps} />
    );

    expect(screen.queryByText('SQL执行解释')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('查看SQL执行解释'));

    expect(screen.queryByText('SQL执行解释')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it('should render risk warning section when businessNonEquivalentDesc exists', () => {
    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    expect(screen.getByText('风险提示')).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.businessNonEquivalentDesc!)
    ).toBeInTheDocument();
  });

  it('should handle copy SQL action', () => {
    const mockCopyTextByTextarea = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextarea);

    superRender(<OverallRewrittenSuggestion {...mockProps} />);

    const copyButton = screen.getByText('复制重写后SQL');
    fireEvent.click(copyButton);

    expect(mockCopyTextByTextarea).toHaveBeenCalledWith(mockProps.rewrittenSql);
  });

  it('should handle copy sql action when use DDL', () => {
    const mockCopyTextByTextarea = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextarea);

    superRender(
      <OverallRewrittenSuggestion
        {...mockProps}
        suggestions={SqlRewrittenMockDataUseDDL.suggestions!}
      />
    );

    const copyButtons = screen.getAllByText('复制重写后SQL');
    expect(copyButtons).toHaveLength(2);
    fireEvent.click(copyButtons[0]);

    expect(mockCopyTextByTextarea).toHaveBeenCalledWith(
      SqlRewrittenMockDataUseDDL.suggestions
        ?.map((v) => v.ddl_dcl)
        .filter(Boolean)
        .join('\n\n')
    );
  });

  it('should not render sections when corresponding props are empty', () => {
    const mockEmptyProps = {
      ...mockProps,
      suggestions: [],
      rewrittenSql: undefined,
      businessNonEquivalentDesc: ''
    };

    superRender(<OverallRewrittenSuggestion {...mockEmptyProps} />);

    expect(screen.queryByText('数据库结构变更语句')).not.toBeInTheDocument();
    expect(screen.queryByText('SQL重写结果')).not.toBeInTheDocument();
    expect(screen.queryByText('风险提示')).not.toBeInTheDocument();
  });
});
