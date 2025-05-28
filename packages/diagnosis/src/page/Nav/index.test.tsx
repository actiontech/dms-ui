import Nav from '.';
import { diagnosisSuperRender } from '../../testUtils/superRender';
import { act } from '@testing-library/react';

describe('diagnosis/Nav', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = diagnosisSuperRender(<Nav />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
  });
});
