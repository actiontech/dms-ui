/**
 * @test_version ce
 */

import { superRender } from '../../../testUtils/customRender';
import SqlRewrittenDrawerCE from '../index.ce';

describe('SqlRewrittenDrawerCE', () => {
  it('should match snapshot', () => {
    const { baseElement } = superRender(
      <SqlRewrittenDrawerCE
        onClose={jest.fn()}
        open
        originSqlInfo={{ sql: 'select 1', number: 1 }}
        maskClosable
        width={920}
        title="sql rewrite"
        taskID="1"
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
