import { cleanup, act } from '@testing-library/react';
import MenuList from '.';

import { superRender } from '../../../../testUtils/customRender';

const projectID = '700300';

describe('base/page/Nav/SideMenu/MenuList', () => {
  const customRender = (isAdmin = false) => {
    return superRender(<MenuList projectID={projectID} isAdmin={isAdmin} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when is not admin', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when is admin', async () => {
    const { baseElement } = customRender(true);

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render is not admin snap when has location pathname', async () => {
    const { baseElement } = superRender(
      <MenuList projectID={projectID} isAdmin={false} />,
      undefined,
      {
        routerProps: {
          initialEntries: [`/project/${projectID}/member`]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render is admin snap when has location pathname', async () => {
    const { baseElement } = superRender(
      <MenuList projectID={projectID} isAdmin={true} />,
      undefined,
      {
        routerProps: {
          initialEntries: [`/project/${projectID}/member`]
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
