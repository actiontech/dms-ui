import { useNavigate } from 'react-router-dom';
import ProjectTitle from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('diagnosis/ProjectTitle', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = superRender(<ProjectTitle />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
  });

  it('should return to home page by click project title', async () => {
    const { baseElement } = superRender(<ProjectTitle />);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.home-page-shortcut'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
