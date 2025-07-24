/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import OperationRecord from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe('slqe/OperationRecord CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = superRender(<OperationRecord />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('导出')).not.toBeInTheDocument();
  });
});
