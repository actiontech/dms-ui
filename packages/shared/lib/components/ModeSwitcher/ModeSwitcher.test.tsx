import { fireEvent, screen } from '@testing-library/dom';
import ModeSwitcher from './ModeSwitcher';
import { superRender } from '../../testUtil/customRender';
import { useState } from 'react';

const list_1 = ['key1', 'key2', 'key3'];
const list_2 = [
  {
    label: 'label1',
    value: 'value1',
    icon: <span>icon</span>,
    colProps: {
      span: 2
    }
  },
  {
    label: 'label2',
    value: 'value2',
    icon: <span>icon</span>,
    colProps: {
      span: 2
    }
  },
  {
    label: 'label3',
    value: 'value3',
    icon: <span>icon</span>,
    colProps: {
      span: 2
    }
  }
];

describe('test ModeSwitcher', () => {
  it('should render basic mode switcher with string options', () => {
    const { container } = superRender(<ModeSwitcher options={list_1} />);
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));
    expect(screen.getByText('key1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('key2').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    fireEvent.click(screen.getByText('key2'));
    expect(screen.getByText('key1').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('key2').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });

  it('should render mode switcher with object options and handle icon display', () => {
    const { container } = superRender(
      <ModeSwitcher
        options={list_2}
        className="custom-class"
        rowProps={{ gutter: 16 }}
      />
    );
    expect(container).toMatchSnapshot();

    expect(
      container.querySelector('.actiontech-mode-switcher.custom-class')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.actiontech-mode-switcher-item-icon')
    ).toBeInTheDocument();
    expect(screen.getAllByText('icon')).toHaveLength(3);

    fireEvent.click(screen.getByText('label1'));
    expect(screen.getByText('label1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });

  it('should work with defaultValue and controlled value', () => {
    const { container } = superRender(
      <ModeSwitcher options={list_2} defaultValue="value1" />
    );
    expect(container).toMatchSnapshot();
    expect(screen.getByText('label1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });

  it('should handle disabled state correctly', () => {
    superRender(<ModeSwitcher options={list_2} disabled />);

    const items = screen.getAllByText(/label[1-3]/);
    items.forEach((item) => {
      expect(item.parentNode).toHaveClass(
        'actiontech-mode-switcher-item-disabled'
      );
      fireEvent.click(item);
      expect(item.parentNode).not.toHaveClass(
        'actiontech-mode-switcher-item-active'
      );
    });
  });
});
