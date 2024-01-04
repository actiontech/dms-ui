/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import OperationRecord from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('slqe/OperationRecord CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(<OperationRecord />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('导出')).not.toBeInTheDocument();
  });
});
