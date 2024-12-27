import { superRender } from '../../../../../testUtils/customRender';
import RewrittenSqlCommonEditor from '../../../components/Common/RewrittenSqlCommonEditor';

describe('RewrittenSqlCommonEditor', () => {
  const mockProps = {
    showSqlDifference: true,
    originalSql: 'SELECT * FROM table;',
    rewrittenSql: 'SELECT id, name FROM table WHERE active = true;'
  };

  it('should render DiffViewOnlyEditor when showSqlDifference is true', () => {
    expect(
      superRender(<RewrittenSqlCommonEditor {...mockProps} />).container
    ).toMatchSnapshot();
  });

  it('should render ViewOnlyEditor when showSqlDifference is false', () => {
    expect(
      superRender(<RewrittenSqlCommonEditor {...mockProps} />).container
    ).toMatchSnapshot();
  });
});
