import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import Home from '..';
import { superRender } from '../../../testUtils/customRender';
import { screen } from '@testing-library/react';

describe('test base/page/Home', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  test('should match snapshot', () => {
    const { baseElement } = superRender(<Home />);

    expect(baseElement).toMatchSnapshot();

    // expect(screen.queryByText('新建同步任务')).toBeInTheDocument();
  });
});
