import { screen } from '@testing-library/react';
import ActionButton from '../ActionButton';
import { superRender } from '../../../testUtil/customRender';

describe('ActionButton', () => {
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

  it('renders a confirm button', () => {
    const { container } = superRender(
      <ActionButton
        actionType="confirm"
        text="Delete"
        confirm={{ title: 'Are you sure?' }}
      />
    );
    const button = screen.getByText('Delete');
    expect(button).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders a tooltip button', () => {
    const { container } = superRender(
      <ActionButton
        actionType="tooltip"
        text="Info"
        tooltip={{ title: 'More information' }}
      />
    );
    const button = screen.getByText('Info');
    expect(button).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
