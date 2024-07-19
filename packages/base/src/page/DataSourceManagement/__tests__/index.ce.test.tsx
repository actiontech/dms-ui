/**
 * @test_version ce
 */

import { fireEvent } from '@testing-library/dom';
import DataSourceManagement from '..';
import { superRender } from '../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('test DataSourceManagement ce', () => {
  it('should match snapshot', () => {
    mockUseCurrentUser({ isAdmin: true });
    const { container, getByText } = superRender(<DataSourceManagement />);

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('外部数据源同步'));
    expect(container).toMatchSnapshot();
  });
});
