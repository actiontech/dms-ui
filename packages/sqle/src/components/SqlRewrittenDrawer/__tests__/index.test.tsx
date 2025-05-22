import { shallow } from 'enzyme';
import SqlRewrittenDrawer from '..';
import toJson from 'enzyme-to-json';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { SqlRewrittenDrawerProps } from '../index.type';
import { fireEvent } from '@testing-library/dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

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

  it('should call onClose on close icon click', () => {
    sqleSuperRender(<SqlRewrittenDrawer {...mockProps} />);

    fireEvent.click(getBySelector('.closed-icon-custom'));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});
