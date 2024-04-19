import { fireEvent, screen } from '@testing-library/dom';
import ToggleTokens from '.';
import { superRender } from '../../testUtil/customRender';
import { useState } from 'react';

const list_1 = ['key1', 'key2', 'key3'];
const list_2 = [
  {
    label: 'label1',
    value: 'value1'
  },
  {
    label: 'label2',
    value: 'value2'
  },
  {
    label: 'label3',
    value: 'value3'
  }
];

describe('test ToggleTokens/single', () => {
  it('render snapshot with Array<string> type options', () => {
    const { container } = superRender(<ToggleTokens options={list_1} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));

    expect(screen.getByText('key1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));

    expect(screen.getByText('key1').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key3').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render snapshot with Array<object> type options', () => {
    const { container } = superRender(<ToggleTokens options={list_2} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('label2'));
    expect(screen.getByText('label1').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    fireEvent.click(screen.getByText('label3'));

    expect(screen.getByText('label3').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render snapshot with Array<object> type options and control', () => {
    const ControlCom = () => {
      const [value, setValue] = useState<string | undefined>('value3');

      return (
        <>
          <ToggleTokens options={list_2} value={value} onChange={setValue} />
          {value}
        </>
      );
    };
    const { container } = superRender(<ControlCom />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('value1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('value2')).toBeInTheDocument();
  });
});

describe('test ToggleTokens/multiple', () => {
  it('render snapshot with Array<string> type options', () => {
    const { container } = superRender(
      <ToggleTokens options={list_1} multiple withCheckbox />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));

    expect(screen.getByText('key1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));
    expect(screen.getByText('key1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render snapshot with Array<object> type options', () => {
    const { container } = superRender(
      <ToggleTokens options={list_2} multiple />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('label2'));
    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    fireEvent.click(screen.getByText('label3'));

    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label3').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label3'));
    expect(screen.getByText('label1').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').closest('button')).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render snapshot with Array<object> type options and control', () => {
    const ControlCom = () => {
      const [value, setValue] = useState<string[] | undefined>([
        'value1',
        'value2'
      ]);

      return (
        <>
          <ToggleTokens
            options={list_2}
            value={value}
            onChange={setValue}
            multiple
          />
          {value?.join(',')}
        </>
      );
    };
    const { container } = superRender(<ControlCom />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').closest('button')).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();
  });
});
