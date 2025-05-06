import { fireEvent, screen } from '@testing-library/react';
import useBack from '../../hooks/useBack';
import { superRender } from '../../testUtil/customRender';
import BackButton from './BackButton';

jest.mock('../../hooks/useBack', () => {
  const goBack = jest.fn();
  return () => ({
    goBack
  });
});

describe('BackButton', () => {
  const goBack = useBack().goBack as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<BackButton />);
    expect(container).toMatchSnapshot();
  });

  it('should render basic button with left arrow icon', () => {
    const { container } = superRender(<BackButton />);
    expect(
      container.querySelector('[data-testid="left-arrow-icon"]')
    ).toBeInTheDocument();
  });

  it('should call goBack function when click the button', () => {
    superRender(<BackButton>back</BackButton>);
    fireEvent.click(screen.getByText('back'));
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('should pass custom props to BasicButton', () => {
    superRender(<BackButton className="custom-class" disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toBeDisabled();
  });
});
