import { fireEvent, screen } from '@testing-library/dom';
import SegmentedTabs from '.';
import { renderWithReduxAndTheme } from '../../testUtil/customRender';
import { getBySelector } from '../../testUtil/customQuery';

describe('lib/BasicSegmentedPage', () => {
  const items = [
    {
      label: 'label1',
      value: 'test1',
      children: 'test1-children'
    },
    {
      label: 'label2',
      value: 'test2',
      children: 'test2-children'
    }
  ];
  it('should match snapshot with controlled', () => {
    const mockChange = jest.fn();
    const { baseElement } = renderWithReduxAndTheme(
      <SegmentedTabs activeKey="test1" onChange={mockChange} items={items} />
    );
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('label2'));
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange).toHaveBeenCalledWith('test2');
  });

  it('should match snapshot with no controlled', () => {
    const { baseElement } = renderWithReduxAndTheme(
      <SegmentedTabs items={items} />
    );
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
  });

  it('should render segmented row extra content', () => {
    renderWithReduxAndTheme(
      <SegmentedTabs
        items={items}
        segmentedRowExtraContent={<span>segmentedRowExtraContent</span>}
      />
    );

    expect(screen.getByText('segmentedRowExtraContent')).toBeInTheDocument();
  });

  it('should render segmented row class name', () => {
    renderWithReduxAndTheme(
      <SegmentedTabs
        items={items}
        segmentedRowClassName="segmentedRowClassName"
      />
    );

    expect(getBySelector('.segmentedRowClassName')).toBeInTheDocument();
  });

  it('should set default active key', () => {
    const { container } = renderWithReduxAndTheme(
      <SegmentedTabs items={items} defaultActiveKey="test2" />
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
    expect(container).toMatchSnapshot();
  });

  it('should set root class name', () => {
    renderWithReduxAndTheme(
      <SegmentedTabs items={items} rootClassName="rootClassName" />
    );

    expect(getBySelector('.rootClassName')).toBeInTheDocument();
  });
});
