/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import PluginAudit from '..';
import { superRender } from '../../../testUtils/customRender';

describe('page/PluginAudit', () => {
  it('render ce plugin audit page', () => {
    const { baseElement } = superRender(<PluginAudit />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('IDE审核')?.[0]).toBeInTheDocument();
  });
});
