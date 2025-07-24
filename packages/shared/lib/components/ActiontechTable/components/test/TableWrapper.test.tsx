import { superRender } from '../../../../testUtil/superRender';
import TableWrapper from '../TableWrapper';

describe('TableWrapper', () => {
  it('should render TableWrapper with loading', () => {
    const { container } = superRender(
      <TableWrapper loading={true}>
        <div>TableWrapper</div>
      </TableWrapper>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render TableWrapper with setting', () => {
    const { getByText } = superRender(
      <TableWrapper
        loading={false}
        setting={{
          tableName: 'Name',
          username: 'name'
        }}
      >
        <div>TableWrapper</div>
      </TableWrapper>
    );
    expect(getByText('TableWrapper')).toBeInTheDocument();
  });
});
