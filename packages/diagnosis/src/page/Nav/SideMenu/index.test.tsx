import SideMenu from '.';
import { superRender } from '../../../testUtils/customRender';
import { screen, act } from '@testing-library/react';

describe('diagnosis/SideMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = superRender(<SideMenu />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
  });
});
