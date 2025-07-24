/**
 * @test_version ce
 */

import { sqleSuperRender } from '../../../testUtils/superRender';
import SqlRewrittenDrawerCE from '../index.ce';

describe('SqlRewrittenDrawerCE', () => {
  it('should match snapshot', () => {
    const { baseElement } = sqleSuperRender(
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
