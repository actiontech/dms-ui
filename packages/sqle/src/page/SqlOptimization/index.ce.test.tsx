/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import SqlOptimization from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('slqe/SqlOptimization CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(<SqlOptimization />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('智能调优')).toBeInTheDocument();
  });
});
