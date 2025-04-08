import { screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/customRender';
import ActionButtonGroup from '../ActionButtonGroup';

jest.mock('../ActionButton', () => {
  return {
    __esModule: true,
    default: ({ text, actionType, ...props }: any) => (
      <button
        data-testid="mocked-action-button"
        data-action-type={actionType}
        {...props}
      >
        {text}
      </button>
    )
  };
});

describe('ActionButtonGroup', () => {
  it('should render all buttons with correct props', () => {
    superRender(
      <ActionButtonGroup
        actions={[
          { key: 'button', text: 'Click Me' },
          {
            key: 'link',
            text: 'Go to Home',
            actionType: 'navigate-link',
            link: { to: '/' }
          },
          {
            key: 'confirm',
            text: 'Delete',
            actionType: 'confirm',
            confirm: { title: 'Are you sure' }
          }
        ]}
      />
    );

    const buttons = screen.getAllByTestId('mocked-action-button');
    expect(buttons).toHaveLength(3);
    expect(buttons[1]).toHaveAttribute('data-action-type', 'navigate-link');
  });

  it('should not render anything when actions array is empty', () => {
    const { container } = superRender(<ActionButtonGroup actions={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should pass space props correctly', () => {
    const { container } = superRender(
      <ActionButtonGroup
        actions={[{ key: 'button', text: 'Click Me' }]}
        size="large"
        className="custom-space"
      />
    );

    expect(container.firstChild).toHaveClass('custom-space');
  });
});
