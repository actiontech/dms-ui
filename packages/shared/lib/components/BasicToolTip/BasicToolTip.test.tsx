import { getBySelector } from '../../testUtil/customQuery';
import { superRender } from '../../testUtil/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { BasicTooltipProps } from './BasicToolTip.types';
import BasicToolTip from './BasicToolTip';

describe('lib/BasicToolTip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: BasicTooltipProps) => {
    return superRender(<BasicToolTip {...params} />);
  };

  it('should render without title', () => {
    const { container } = customRender({
      children: <span>content</span>
    });
    expect(
      container.querySelector('.basic-tooltips-wrapper')
    ).not.toBeInTheDocument();
    expect(container).toHaveTextContent('content');
  });

  it('should render with custom class name', async () => {
    const { baseElement } = customRender({
      children: <span className="custom-children-name">tool tip</span>,
      className: 'custom-tool-tip-name',
      title: 'this is a tip'
    });
    await act(async () => {
      fireEvent.mouseOver(getBySelector('.custom-children-name', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });

  describe('icon rendering', () => {
    it('should render with boolean prefix icon', () => {
      const { container } = customRender({
        prefixIcon: true,
        title: 'this is a tip',
        children: <span>content</span>
      });
      expect(
        container.querySelector('.tooltips-default-icon')
      ).toBeInTheDocument();
    });

    it('should render with custom prefix icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Icon</div>;
      customRender({
        prefixIcon: <CustomIcon />,
        title: 'this is a tip',
        children: <span>content</span>
      });
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should not render icon when boolean is false', () => {
      const { container } = customRender({
        suffixIcon: false,
        title: 'this is a tip',
        children: <span>content</span>
      });
      expect(
        container.querySelector('.tooltips-default-icon')
      ).not.toBeInTheDocument();
    });
  });

  it('should render with title width', async () => {
    const { baseElement } = customRender({
      title: 'this is a tip',
      titleWidth: 300,
      children: <span className="custom-children-name">tool tip</span>
    });
    await act(async () => {
      fireEvent.mouseOver(getBySelector('.custom-children-name', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
