import { shallow } from 'enzyme';
import SqlRewrittenDrawer from '..';
import toJson from 'enzyme-to-json';
import { SqlRewrittenDrawerProps } from '../index.type';

describe('SqlRewrittenDrawer', () => {
  const mockProps: SqlRewrittenDrawerProps = {
    open: true,
    onClose: jest.fn(),
    taskID: 'task-123',
    originSqlInfo: {
      sql: 'select * from table',
      number: 1
    }
  };
  it('should match snapshot', () => {
    expect(
      toJson(shallow(<SqlRewrittenDrawer {...mockProps} />))
    ).toMatchSnapshot();
  });
});
