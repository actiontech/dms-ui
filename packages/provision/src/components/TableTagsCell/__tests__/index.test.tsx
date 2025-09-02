import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import TableTagsCell from '../index';

describe('provision/components/TableTagsCell', () => {
  it('render init snap', () => {
    const { baseElement } = superRender(<TableTagsCell dataSource={[]} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('render tags when has data source', () => {
    const { baseElement } = superRender(
      <TableTagsCell dataSource={['123', '234']} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render tags when data source length greater than 4', () => {
    const { baseElement } = superRender(
      <TableTagsCell dataSource={['123', '234', 'a', 'b', 'c']} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render tags when has tagLimit param', () => {
    const { baseElement } = superRender(
      <TableTagsCell dataSource={['123', '234', 'a', 'b', 'c']} tagLimit={10} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
