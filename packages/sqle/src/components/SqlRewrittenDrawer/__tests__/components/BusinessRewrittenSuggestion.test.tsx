import { fireEvent, screen } from '@testing-library/dom';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import BusinessRewrittenSuggestion from '../../components/BusinessRewrittenSuggestion';
import { SqlRewrittenMockDataNoDDL } from '@actiontech/shared/lib/testUtil/mockApi/sqle/task/data';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import BusinessRewrittenDetails from '../../components/BusinessRewrittenSuggestion/BusinessRewrittenDetails';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('BusinessRewrittenSuggestion', () => {
  describe('BusinessRewrittenSuggestion and BusinessRewrittenDetails', () => {
    beforeEach(() => {
      mockUseCurrentUser();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    ignoreConsoleErrors([
      UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE
    ]);

    describe('BusinessRewrittenSuggestion', () => {
      it('should render empty content when dataSource is empty', () => {
        sqleSuperRender(<BusinessRewrittenSuggestion dataSource={[]} />);
        expect(screen.getByText('当前SQL重写无需人工介入')).toBeInTheDocument();
      });

      it('should render list items when dataSource has items', () => {
        const mockDataSource = SqlRewrittenMockDataNoDDL.suggestions?.filter(
          (v) => v.type === RewriteSuggestionTypeEnum.statement
        )!;
        sqleSuperRender(
          <BusinessRewrittenSuggestion dataSource={mockDataSource} />
        );
        expect(getAllBySelector('.ant-list-items')[0].childElementCount).toBe(
          mockDataSource.length
        );
      });
    });

    describe('BusinessRewrittenDetails', () => {
      const mockProps = SqlRewrittenMockDataNoDDL.suggestions![0];

      it('should render markdown content correctly', () => {
        const { container } = sqleSuperRender(
          <BusinessRewrittenDetails {...mockProps} />
        );
        expect(container).toMatchSnapshot();

        const ruleItem = screen.getByText(mockProps.rule_name!);
        fireEvent.click(ruleItem);

        expect(container).toMatchSnapshot();
      });
    });
  });
});
