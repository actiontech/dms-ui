import { MemoryRouterProps } from 'react-router-dom';
import { cleanup } from '@testing-library/react';

import mockUseRoutes, { RenderRouterComponent } from './data';
import { baseSuperRender } from '../../testUtils/superRender';

describe('base/router- un Auth -ee', () => {
  const customRender = (
    initialEntries: MemoryRouterProps['initialEntries'] = []
  ) => {
    return baseSuperRender(<RenderRouterComponent type="unAuth" />, undefined, {
      routerProps: {
        initialEntries
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('render un auth route data snap', () => {
    expect(mockUseRoutes('unAuth')).toMatchSnapshot();
  });

  it('should render login', () => {
    const { baseElement } = customRender(['/login']);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render BindUser', () => {
    const { baseElement } = customRender(['/user/bind']);

    expect(baseElement).toMatchSnapshot();
  });
});
