import { cleanup } from '@testing-library/react';
import SqlAudit from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe.skip('sqle/SqlAudit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = superRender(<SqlAudit />);
    expect(baseElement).toMatchSnapshot();
  });
});
