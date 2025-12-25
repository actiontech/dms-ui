import { fireEvent, screen } from '@testing-library/dom';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import RewrittenSuggestionDetails from '../../components/RewrittenSuggestionDetails';
import {
  SqlRewrittenMockDataNoDDL,
  SqlRewrittenMockDataUseDDL,
  SqlRewrittenMockDataWithNotRewriter
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  getAllBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import RewrittenSuggestionItem from '../../components/RewrittenSuggestionDetails/RewrittenSuggestionItem';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { Copy } from '@actiontech/dms-kit';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('RewrittenSuggestionDetails and RewrittenSuggestionItem', () => {
  const originalSql = `
    SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id AND UPPER(o.status) = 'COMPLETED'
JOIN payments p ON u.id = p.user_id
WHERE YEAR(u.created_at) = 2023
  AND o.amount > '100'
  AND p.status IS NOT NULL
  AND o.description LIKE '%test%'
  OR LOWER(u.email) LIKE '%example%'
ORDER BY RAND(), p.created_at DESC
LIMIT 1000 OFFSET 500;
  `;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('RewrittenSuggestionDetails', () => {
    it('should render empty content when dataSource is empty', () => {
      const props = {
        dataSource: [],
        originalSql,
        taskID: 'task-123',
        sqlNumber: 1,
        instanceName: 'mysql',
        schema: 'dms'
      };

      sqleSuperRender(<RewrittenSuggestionDetails {...props} />);
      expect(screen.getByText('当前SQL无优化空间')).toBeInTheDocument();
    });

    it('should render list items when dataSource has items', () => {
      const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
        (v) => v.type === RewriteSuggestionTypeEnum.statement
      )!;
      const props = {
        dataSource: mockDataSource,
        originalSql,
        taskID: 'task-123',
        sqlNumber: 1,
        instanceName: 'mysql',
        schema: 'dms'
      };

      sqleSuperRender(<RewrittenSuggestionDetails {...props} />);
      expect(getAllBySelector('.ant-list-items')[0].childElementCount).toBe(
        mockDataSource.length
      );
    });
  });

  describe('RewrittenSuggestionItem', () => {
    ignoreConsoleErrors([
      UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE,
      UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
    ]);

    const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
      (v) => v.type === RewriteSuggestionTypeEnum.statement
    )[0]! as Required<IRewriteSuggestion>;

    const mockUseDDLDataSource = SqlRewrittenMockDataUseDDL.suggestions?.find(
      (v) => v.ddl_dcl
    )! as Required<IRewriteSuggestion>;

    const mockProps = {
      dataSource: mockDataSource,
      originalSql,
      taskID: 'task-123',
      sqlNumber: 1,
      instanceName: 'mysql',
      schema: 'dms'
    };

    it('should toggle details visibility on click', () => {
      const { container } = sqleSuperRender(
        <RewrittenSuggestionItem {...mockProps} />
      );

      const ruleItem = screen.getByText(mockDataSource.rule_name);
      fireEvent.click(ruleItem);

      expect(container).toMatchSnapshot();
    });

    it('should display combined SQL for subsequent items', () => {
      const mockDataSourceParam = SqlRewrittenMockDataNoDDL.suggestions?.filter(
        (v) => v.type === RewriteSuggestionTypeEnum.statement
      )!;
      const { container } = sqleSuperRender(
        <RewrittenSuggestionDetails
          dataSource={[mockDataSourceParam[0], mockDataSourceParam[1]]}
          originalSql={mockProps.originalSql}
          taskID={mockProps.taskID}
          sqlNumber={mockProps.sqlNumber}
        />
      );

      fireEvent.click(screen.getByText(mockDataSourceParam[0].rule_name!));
      expect(container).toMatchSnapshot();
    });

    it('should handle copy SQL action', () => {
      const mockCopyTextByTextareaSpy = jest.fn();
      jest
        .spyOn(Copy, 'copyTextByTextarea')
        .mockImplementation(mockCopyTextByTextareaSpy);

      sqleSuperRender(<RewrittenSuggestionItem {...mockProps} />);

      const ruleItem = screen.getByText(mockDataSource.rule_name);
      fireEvent.click(ruleItem);
      expect(
        screen.getByText('复制重写后SQL').closest('button')
      ).not.toHaveAttribute('hidden');
      const copyButton = screen.getByText('复制重写后SQL');
      fireEvent.click(copyButton);

      expect(mockCopyTextByTextareaSpy).toHaveBeenCalledWith(
        `${mockProps.dataSource.rewritten_sql}`
      );
    });

    it('should handle show SQL difference action', () => {
      const { container } = sqleSuperRender(
        <RewrittenSuggestionItem
          {...mockProps}
          dataSource={mockUseDDLDataSource}
        />
      );
      const ruleItem = screen.getByText(mockUseDDLDataSource.rule_name);
      fireEvent.click(ruleItem);

      expect(screen.getByText('查看差异')).not.toHaveAttribute('hidden');

      const diffToggle = screen.getByText('查看差异');
      fireEvent.click(diffToggle);

      expect(container).toMatchSnapshot();
    });

    it('should render SQL analysis link if DDL/DCL exists', () => {
      sqleSuperRender(
        <RewrittenSuggestionItem
          {...mockProps}
          dataSource={mockUseDDLDataSource}
        />
      );

      const ruleItem = screen.getByText(mockUseDDLDataSource.rule_name);
      fireEvent.click(ruleItem);

      expect(screen.getByText('在SQL分析中查看当前表结构')).toHaveAttribute(
        'href',
        `/sqle/project/700300/exec-workflow/${mockProps.taskID}/${mockProps.sqlNumber}/analyze?instance_name=mysql&schema=dms`
      );
    });

    it('should not render SQL difference related components when rewrittenSQL is equal originalSQL', () => {
      const dataSource = SqlRewrittenMockDataWithNotRewriter.suggestions![1];
      sqleSuperRender(
        <RewrittenSuggestionItem
          {...mockProps}
          originalSql={dataSource.rewritten_sql!}
          dataSource={dataSource}
        />
      );

      const ruleItem = screen.getByText(dataSource.rule_name!);
      fireEvent.click(ruleItem);

      expect(
        screen.getByText('复制重写后SQL').closest('button')
      ).toHaveAttribute('hidden');
      expect(screen.getByText('查看差异')).toHaveAttribute('hidden');
      expect(
        queryBySelector(
          '.actiontech-diff-sql-view-only-editor-renderer-wrapper'
        )
      ).not.toBeInTheDocument();
      expect(
        queryBySelector('.actiontech-sql-view-only-editor-renderer-wrapper')
      ).not.toBeInTheDocument();
    });
  });
});
