import Nav from '.';
import { superRender } from '../../testUtils/customRender';
import { act } from '@testing-library/react';

describe('diagnosis/Nav', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = superRender(<Nav />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
  });
});
