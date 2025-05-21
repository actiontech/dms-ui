import { fireEvent, screen } from '@testing-library/dom';
import { superRender } from '../../testUtil/superRender';
import { getBySelector } from '../../testUtil/customQuery';
import BasicTreeSelect from './BasicTreeSelect';

describe('BasicTreeSelect', () => {
  const mockProps = {
    className: 'custom-class',
    allowClear: true,
    loading: false,
    popupClassName: 'custom-popup-class',
    treeData: [
      {
        value: 'parent 1',
        title: 'parent 1',
        children: [
          {
            value: 'parent 1-0',
            title: 'parent 1-0',
            children: [
              {
                value: 'leaf1',
                title: 'leaf1'
              },
              {
                value: 'leaf2',
                title: 'leaf2'
              },
              {
                value: 'leaf3',
                title: 'leaf3'
              },
              {
                value: 'leaf4',
                title: 'leaf4'
              },
              {
                value: 'leaf5',
                title: 'leaf5'
              },
              {
                value: 'leaf6',
                title: 'leaf6'
              }
            ]
          },
          {
            value: 'parent 1-1',
            title: 'parent 1-1',
            children: [
              {
                value: 'leaf11',
                title: <b style={{ color: '#08c' }}>leaf11</b>
              }
            ]
          }
        ]
      }
    ]
  };

  it('should render the component with all elements', () => {
    superRender(<BasicTreeSelect {...mockProps} />);

    expect(screen.getByText('请选择{{name}}')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(getBySelector('.basic-tree-select-wrapper')).toHaveClass(
      'custom-class'
    );
  });

  it('should render the dropdown menu correctly', () => {
    superRender(<BasicTreeSelect {...mockProps} />);

    const treeSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(treeSelect);

    const customMenu = screen.getByTestId(
      'basic-tree-select-popup-menu-style-wrapper'
    );
    expect(customMenu).toBeInTheDocument();
  });

  it('should render the not found content when loading is true', () => {
    superRender(<BasicTreeSelect {...mockProps} loading={true} />);

    const treeSelect = screen.getByRole('combobox');
    fireEvent.mouseDown(treeSelect);

    const customMenu = screen.getByTestId(
      'basic-tree-select-popup-menu-style-wrapper'
    );
    expect(customMenu).toMatchSnapshot();
  });
});
