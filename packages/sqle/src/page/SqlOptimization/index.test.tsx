import { act, cleanup } from '@testing-library/react';
import SqlOptimization from '.';
import { superRender } from '../../testUtils/customRender';

describe('sqle/SqlOptimization', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = superRender(<SqlOptimization />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
