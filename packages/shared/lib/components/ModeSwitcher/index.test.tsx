import { fireEvent, screen } from '@testing-library/dom';
import ModeSwitcher from '.';
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
  it('render snapshot with Array<string> type options', () => {
    const { container } = superRender(<ModeSwitcher options={list_1} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));

    expect(screen.getByText('key1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('key2').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('key3').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));

    expect(screen.getByText('key1').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('key2').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key3').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });

  it('render snapshot with Array<object> type options', () => {
    const { container } = superRender(<ModeSwitcher options={list_2} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('label2'));
    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    fireEvent.click(screen.getByText('label3'));

    expect(screen.getByText('label3').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });

  it('render snapshot with Array<object> type options and control', () => {
    const ControlCom = () => {
      const [value, setValue] = useState<string | undefined>('value3');

      return (
        <>
          <ModeSwitcher
            options={list_2}
            value={value}
            onChange={setValue}
            rowProps={{ gutter: 10 }}
          />
          {value}
        </>
      );
    };
    const { container } = superRender(<ControlCom />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    expect(screen.getByText('value1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').parentNode).toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    expect(screen.getByText('value2')).toBeInTheDocument();
  });

  it('render snapshot when disabled props is equal true', () => {
    const { container } = superRender(
      <ModeSwitcher options={list_2} disabled />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );

    fireEvent.click(screen.getByText('label2'));
    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    expect(screen.getByText('label2').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
    fireEvent.click(screen.getByText('label3'));

    expect(screen.getByText('label3').parentNode).not.toHaveClass(
      'actiontech-mode-switcher-item-active'
    );
  });
});
