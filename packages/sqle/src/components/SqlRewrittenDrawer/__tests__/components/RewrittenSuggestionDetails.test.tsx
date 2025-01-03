import { fireEvent, screen } from '@testing-library/dom';
import { superRender } from '../../../../testUtils/customRender';
import RewrittenSuggestionDetails from '../../components/RewrittenSuggestionDetails';
import {
  SqlRewrittenMockDataNoDDL,
  SqlRewrittenMockDataUseDDL
} from '../../../../testUtils/mockApi/task/data';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import RewrittenSuggestionItem from '../../components/RewrittenSuggestionDetails/RewrittenSuggestionItem';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { Copy } from '@actiontech/shared';

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

  describe('RewrittenSuggestionDetails', () => {
    beforeEach(() => {
      mockUseCurrentProject();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should render empty content when dataSource is empty', () => {
      const props = {
        dataSource: [],
        originalSql,
        taskID: 'task-123',
        sqlNumber: 1
      };

      superRender(<RewrittenSuggestionDetails {...props} />);
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
        sqlNumber: 1
      };

      superRender(<RewrittenSuggestionDetails {...props} />);
      expect(getAllBySelector('.ant-list-items')[0].childElementCount).toBe(
        mockDataSource.length
      );
    });
  });

  describe('RewrittenSuggestionItem', () => {
    beforeEach(() => {
      mockUseCurrentProject();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    ignoreConsoleErrors([
      UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE
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
      sqlNumber: 1
    };

    it('should toggle details visibility on click', () => {
      const { container } = superRender(
        <RewrittenSuggestionItem {...mockProps} />
      );

      const ruleItem = screen.getByText(mockDataSource.rule_name);
      fireEvent.click(ruleItem);

      expect(container).toMatchSnapshot();
    });

    it('should display combined SQL for subsequent items', () => {
      const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
        (v) => v.type === RewriteSuggestionTypeEnum.statement
      )!;
      const { container } = superRender(
        <RewrittenSuggestionDetails
          dataSource={[mockDataSource[0], mockDataSource[1]]}
          originalSql={mockProps.originalSql}
          taskID={mockProps.taskID}
          sqlNumber={mockProps.sqlNumber}
        />
      );

      fireEvent.click(screen.getByText(mockDataSource[0].rule_name!));
      expect(container).toMatchSnapshot();
    });

    it('should handle copy SQL action', () => {
      const mockCopyTextByTextareaSpy = jest.fn();
      jest
        .spyOn(Copy, 'copyTextByTextarea')
        .mockImplementation(mockCopyTextByTextareaSpy);

      superRender(<RewrittenSuggestionItem {...mockProps} />);

      const ruleItem = screen.getByText(mockDataSource.rule_name);
      fireEvent.click(ruleItem);

      const copyButton = screen.getByText('复 制');
      fireEvent.click(copyButton);

      expect(mockCopyTextByTextareaSpy).toHaveBeenCalledWith(
        `${mockProps.dataSource.rewritten_sql}`
      );
    });

    it('should handle show SQL difference action', () => {
      const { container } = superRender(
        <RewrittenSuggestionItem
          {...mockProps}
          dataSource={mockUseDDLDataSource}
        />
      );
      const ruleItem = screen.getByText(mockUseDDLDataSource.rule_name);
      fireEvent.click(ruleItem);

      const diffToggle = screen.getByText('查看差异');
      fireEvent.click(diffToggle);

      expect(container).toMatchSnapshot();
    });

    it('should render SQL analysis link if DDL/DCL exists', () => {
      superRender(
        <RewrittenSuggestionItem
          {...mockProps}
          dataSource={mockUseDDLDataSource}
        />
      );

      const ruleItem = screen.getByText(mockUseDDLDataSource.rule_name);
      fireEvent.click(ruleItem);

      expect(screen.getByText('在SQL分析中查看当前表结构')).toHaveAttribute(
        'href',
        `/sqle/project/700300/exec-workflow/${mockProps.taskID}/${mockProps.sqlNumber}/analyze`
      );
    });
  });
});