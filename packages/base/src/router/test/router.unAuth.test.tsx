import { MemoryRouterProps } from 'react-router-dom';
import { act, screen, cleanup } from '@testing-library/react';

import { RenderRouterComponent } from './data';
import { superRender } from '../../testUtils/customRender';

describe('base/router- un Auth -ee', () => {
  const customRender = (
    initialEntries: MemoryRouterProps['initialEntries'] = []
  ) => {
    return superRender(<RenderRouterComponent type="unAuth" />, undefined, {
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

  it('should render login', () => {
    const { baseElement } = customRender(['/login']);

    expect(baseElement).toMatchSnapshot();
  });

  it('should render BindUser', () => {
    const { baseElement } = customRender(['/user/bind']);

    expect(baseElement).toMatchSnapshot();
  });
});
