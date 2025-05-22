/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import PluginAudit from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';

describe('page/PluginAudit', () => {
  it('render ce plugin audit page', () => {
    const { baseElement } = sqleSuperRender(<PluginAudit />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('IDE审核')?.[0]).toBeInTheDocument();
  });
});
