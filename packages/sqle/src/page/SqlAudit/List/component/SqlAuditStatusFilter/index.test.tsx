import SqlAuditStatusFilter from '.';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
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
    const { baseElement } = renderWithReduxAndTheme(
      <SqlAuditStatusFilter status="all" onChange={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('审核中'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
