/**
 * @test_version ce
 */

import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { renderLocationDisplay } from '@actiontech/shared/lib/testUtil/LocationDisplay';
import CEIndexProjectDetail from '../index.ce';
import { cleanup, screen } from '@testing-library/react';

describe('test base/page/project/detail/ce', () => {
  it('should replace to "/" when pathname is "/project"', () => {
    const [, LocationComponent] = renderLocationDisplay();
    superRender(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { routerProps: { initialEntries: ['/project/overview'] } }
    );

    expect(screen.getByTestId('location-display')).toHaveTextContent(
      '/project/overview'
    );

    cleanup();

    superRender(
      <>
        <CEIndexProjectDetail /> <LocationComponent />
      </>,
      undefined,
      { routerProps: { initialEntries: ['/project'] } }
    );
    expect(screen.getByTestId('location-display')).toHaveTextContent('/');
  });
});
