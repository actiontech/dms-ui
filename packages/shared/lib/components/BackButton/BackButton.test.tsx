import { fireEvent, screen } from '@testing-library/react';
import useBack from '../../hooks/useBack';
import { renderWithTheme } from '../../testUtil/customRender';
import BackButton from './BackButton';

jest.mock('../../hooks/useBack', () => {
  const goBack = jest.fn();
  return () => ({
    goBack
  });
});

describe('BackButton', () => {
  const goBack = useBack().goBack as jest.Mock;

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should render a button', () => {
    const { container } = renderWithTheme(<BackButton />);
    expect(container).toMatchSnapshot();
  });

  test('should call goBack function when click the button', () => {
    renderWithTheme(<BackButton>back</BackButton>);
    fireEvent.click(screen.getByText('back'));

    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
