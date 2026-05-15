import { cleanup } from '@testing-library/react';
import AccountPanel from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe('GlobalDashboard/AccountPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render null content', () => {
    const { container } = superRender(<AccountPanel />);
    expect(container.firstChild).toBeNull();
  });
});
