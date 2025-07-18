/**
 * @test_version ce
 */

import { fireEvent } from '@testing-library/dom';
import DataSourceManagement from '..';
import { baseSuperRender } from '../../../testUtils/superRender';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('test DataSourceManagement ce', () => {
  it('should match snapshot', () => {
    mockUsePermission(
      { checkPagePermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
    const { container, getByText } = baseSuperRender(<DataSourceManagement />);

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('外部数据源同步'));
    expect(container).toMatchSnapshot();
  });
});
