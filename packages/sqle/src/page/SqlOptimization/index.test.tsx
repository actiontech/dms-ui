import { act, cleanup } from '@testing-library/react';
import SqlOptimization from '.';
import { sqleSuperRender } from '../../testUtils/superRender';

describe('sqle/SqlOptimization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = sqleSuperRender(<SqlOptimization />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
