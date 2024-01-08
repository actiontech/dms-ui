/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import WhiteList from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('slqe/WhiteList CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(<WhiteList />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('添加白名单')).not.toBeInTheDocument();
  });
});
