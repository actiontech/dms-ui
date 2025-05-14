import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import RewrittenSqlCommonEditor from '../../../components/Common/RewrittenSqlCommonEditor';

describe('RewrittenSqlCommonEditor', () => {
  const mockProps = {
    showSqlDifference: true,
    originalSql: 'SELECT * FROM table;',
    rewrittenSql: 'SELECT id, name FROM table WHERE active = true;'
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  it('should render DiffViewOnlyEditor when showSqlDifference is true', () => {
    expect(
      sqleSuperRender(<RewrittenSqlCommonEditor {...mockProps} />).container
    ).toMatchSnapshot();
  });

  it('should render ViewOnlyEditor when showSqlDifference is false', () => {
    expect(
      sqleSuperRender(<RewrittenSqlCommonEditor {...mockProps} />).container
    ).toMatchSnapshot();
  });
});
