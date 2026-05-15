import { act, fireEvent, screen } from '@testing-library/react';
import ActionButton from '../ActionButton';
import { superRender } from '../../../testUtil/superRender';

describe('ActionButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', () => {
    const { container } = superRender(<ActionButton text="Click me" />);
    expect(container).toMatchSnapshot();
  });

  it('renders a basic button', () => {
    superRender(<ActionButton text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders a navigate link button', () => {
    superRender(
      <ActionButton
        actionType="navigate-link"
        text="Go to Home"
        link={{ to: '/' }}
      />
    );
    const linkButton = screen.getByText('Go to Home');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton.closest('a')).toHaveAttribute('href', '/');
  });

  describe('确认按钮', () => {
    it('should handle confirm dialog interactions correctly', async () => {
      const onConfirm = jest.fn();
      superRender(
        <ActionButton
          actionType="confirm"
          text="Delete"
          confirm={{
            title: 'Are you sure?',
            onConfirm
          }}
        />
      );

      const button = screen.getByText('Delete');
      fireEvent.click(button);

      expect(screen.getByText('Are you sure?')).toBeInTheDocument();

      fireEvent.click(screen.getByText('确 认'));
      expect(onConfirm).toHaveBeenCalled();
    });

    it('should render ReactNode title correctly', () => {
      const titleNode = <div data-testid="custom-title">Custom Title</div>;
      superRender(
        <ActionButton
          actionType="confirm"
          text="Delete"
          confirm={{ title: titleNode }}
        />
      );

      const button = screen.getByText('Delete');
      fireEvent.click(button);

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });
  });

  it('renders a tooltip button', async () => {
    const title = 'More information';
    superRender(
      <ActionButton actionType="tooltip" text="Info" tooltip={{ title }} />
    );
    const button = screen.getByText('Info');
    expect(button).toBeInTheDocument();
    fireEvent.mouseOver(button.closest('button')!);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('should pass additional props to BasicButton', () => {
    superRender(
      <ActionButton
        text="Test"
        className="custom-class"
        data-testid="custom-button"
      />
    );

    const button = screen.getByTestId('custom-button');
    expect(button).toHaveClass('custom-class');
  });
});
