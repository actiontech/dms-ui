import { fireEvent, screen } from '@testing-library/dom';
import SegmentedTabs from './SegmentedTabs';
import { superRender } from '../../testUtil/customRender';
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
    const { baseElement } = superRender(
      <SegmentedTabs activeKey="test1" onChange={mockChange} items={items} />
    );
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('label2'));
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange).toHaveBeenCalledWith('test2');
  });

  it('should match snapshot with no controlled', () => {
    const { baseElement } = superRender(<SegmentedTabs items={items} />);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
  });

  it('should render segmented row extra content', () => {
    superRender(
      <SegmentedTabs
        items={items}
        segmentedRowExtraContent={<span>segmentedRowExtraContent</span>}
      />
    );

    expect(screen.getByText('segmentedRowExtraContent')).toBeInTheDocument();
  });

  it('should render segmented row class name', () => {
    superRender(
      <SegmentedTabs
        items={items}
        segmentedRowClassName="segmentedRowClassName"
      />
    );

    expect(getBySelector('.segmentedRowClassName')).toBeInTheDocument();
  });

  it('should set default active key', () => {
    const { container } = superRender(
      <SegmentedTabs items={items} defaultActiveKey="test2" />
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
    expect(container).toMatchSnapshot();
  });

  it('should set root class name', () => {
    superRender(<SegmentedTabs items={items} rootClassName="rootClassName" />);

    expect(getBySelector('.rootClassName')).toBeInTheDocument();
  });
});
