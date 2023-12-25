/**
 * @test_version ce
 */

import { renderWithMemoryRouter } from '@actiontech/shared/lib/testUtil/customRender';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import CEIndexProjectDetail from '../index.ce';
import { cleanup, screen } from '@testing-library/react';

describe('test base/page/project/detail/ce', () => {
  it('should replace to "/" when pathname is "/project"', () => {
    const [, LocationComponent] = renderLocationDisplay();
    renderWithMemoryRouter(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { initialEntries: ['/project/overview'] }
    );

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/project/overview'
    );

    cleanup();

    renderWithMemoryRouter(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { initialEntries: ['/project'] }
    );
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});
