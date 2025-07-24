/**
 * @test_version ce
 */

import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import Home from '..';
import { baseSuperRender } from '../../../testUtils/superRender';
import { screen } from '@testing-library/react';

describe('test base/page/Home', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  test('should match snapshot', () => {
    const { baseElement } = baseSuperRender(<Home />);

    expect(baseElement).toMatchSnapshot();

    expect(screen.queryByText('新建同步任务')).not.toBeInTheDocument();
  });
});
