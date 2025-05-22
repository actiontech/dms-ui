/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import WhiteList from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe('slqe/WhiteList CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = superRender(<WhiteList />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('添加白名单')).not.toBeInTheDocument();
  });
});
