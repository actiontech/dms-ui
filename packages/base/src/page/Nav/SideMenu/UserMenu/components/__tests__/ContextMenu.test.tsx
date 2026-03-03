import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import ContextMenu from '../ContextMenu';
import { ContextMenuItem } from '../ContextMenu/index.type';

describe('base/page/Nav/SideMenu/UserMenu/ContextMenu', () => {
  const mockOnClick = jest.fn();
  const mockOnOpenChange = jest.fn();

  const mockItems: ContextMenuItem[] = [
    {
      key: 'item1',
      text: 'Menu Item 1',
      onClick: mockOnClick
    },
    {
      key: 'item2',
      text: 'Menu Item 2',
      icon: <span>Icon</span>,
      onClick: mockOnClick
    },
    {
      key: 'item3',
      text: 'Menu Item 3',
      disabled: true,
      onClick: mockOnClick
    },
    {
      key: 'item4',
      text: 'Menu Item 4',
      keepOpenOnClick: true,
      onClick: mockOnClick
    }
  ];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should render context menu with items', async () => {
    const { baseElement } = baseSuperRender(
      <ContextMenu items={mockItems} popoverProps={{ open: true }}>
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Menu Item 1')).toBeInTheDocument();
    expect(screen.getByText('Menu Item 2')).toBeInTheDocument();
    expect(screen.getByText('Menu Item 3')).toBeInTheDocument();
    expect(screen.getByText('Menu Item 4')).toBeInTheDocument();
  });

  it('should render header and footer when provided', async () => {
    const { baseElement } = baseSuperRender(
      <ContextMenu
        items={mockItems}
        header="Header Title"
        footer={<div>Footer Content</div>}
        popoverProps={{ open: true }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should call onClick handler when clicking menu item', async () => {
    baseSuperRender(
      <ContextMenu
        items={mockItems}
        popoverProps={{ open: true, onOpenChange: mockOnOpenChange }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('Menu Item 1'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not call onClick when menu item is disabled', async () => {
    baseSuperRender(
      <ContextMenu
        items={mockItems}
        popoverProps={{ open: true, onOpenChange: mockOnOpenChange }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('Menu Item 3'));

    expect(mockOnClick).not.toHaveBeenCalled();
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it('should keep popover open when keepOpenOnClick is true', async () => {
    baseSuperRender(
      <ContextMenu
        items={mockItems}
        popoverProps={{ open: true, onOpenChange: mockOnOpenChange }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('Menu Item 4'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnOpenChange).not.toHaveBeenCalled();
  });

  it('should toggle popover open state when clicking trigger', async () => {
    const { baseElement } = baseSuperRender(
      <ContextMenu items={mockItems}>
        <button>Trigger</button>
      </ContextMenu>
    );

    const trigger = screen.getByText('Trigger');

    fireEvent.click(trigger);
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('Menu Item 1')).toBeInTheDocument();

    fireEvent.click(trigger);
    await act(async () => jest.advanceTimersByTime(300));

    expect(baseElement).toMatchSnapshot();
  });

  it('should render menu item with icon', async () => {
    baseSuperRender(
      <ContextMenu items={mockItems} popoverProps={{ open: true }}>
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('should apply disabled class to disabled menu items', async () => {
    const { container } = baseSuperRender(
      <ContextMenu items={mockItems} popoverProps={{ open: true }}>
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    const disabledItem = screen.getByText('Menu Item 3').parentElement;
    expect(disabledItem).toHaveClass('content-item-disabled');
  });

  it('should handle controlled open state', async () => {
    const { rerender } = baseSuperRender(
      <ContextMenu
        items={mockItems}
        popoverProps={{ open: false, onOpenChange: mockOnOpenChange }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.queryByText('Menu Item 1')).not.toBeInTheDocument();

    rerender(
      <ContextMenu
        items={mockItems}
        popoverProps={{ open: true, onOpenChange: mockOnOpenChange }}
      >
        <button>Trigger</button>
      </ContextMenu>
    );

    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('Menu Item 1')).toBeInTheDocument();
  });
});
