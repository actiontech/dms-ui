import SqlAuditStatusFilter from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { fireEvent, screen, act, cleanup } from '@testing-library/react';

describe('sqle/SqlAudit/SqlAuditStatusFilter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot when status is all', async () => {
    const { baseElement } = superRender(
      <SqlAuditStatusFilter status="all" onChange={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('审核中'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
