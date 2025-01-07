import { fireEvent, screen } from '@testing-library/dom';
import ToggleTokens from './ToggleTokens';
import { superRender } from '../../testUtil/customRender';
import { useState } from 'react';
import { cleanup } from '@testing-library/react';

const list_1 = ['key1', 'key2', 'key3'];

const optionEvent1 = jest.fn();
const optionEvent2 = jest.fn();
const optionEvent3 = jest.fn();

const list_2 = [
  {
    label: 'label1',
    value: 'value1',
    onClick: optionEvent1
  },
  {
    label: 'label2',
    value: 'value2',
    onClick: optionEvent2
  },
  {
    label: 'label3',
    value: 'value3',
    onClick: optionEvent3
  }
];

describe('test ToggleTokens/single', () => {
  it('render snapshot with Array<string> type options', () => {
    const { container } = superRender(<ToggleTokens options={list_1} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));

    expect(screen.getByText('key1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));

    expect(screen.getByText('key1').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key3').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render options correctly with labelDictionary', () => {
    superRender(
      <ToggleTokens
        options={['option1', 'option2']}
        labelDictionary={{ option1: '选项1', option2: '选项2' }}
      />
    );
    expect(screen.getByText('选项1')).toBeInTheDocument();
    expect(screen.getByText('选项2')).toBeInTheDocument();

    cleanup();

    superRender(
      <ToggleTokens
        options={[
          { label: 'option3', value: 'a1' },
          { label: 'option4', value: 'a2' }
        ]}
        labelDictionary={{ option3: '选项3', option4: '选项4' }}
      />
    );
    expect(screen.getByText('选项3')).toBeInTheDocument();
    expect(screen.getByText('选项4')).toBeInTheDocument();
  });

  it('render snapshot with Array<object> type options', () => {
    const { container } = superRender(<ToggleTokens options={list_2} />);

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(optionEvent1).toHaveBeenCalledTimes(1);
    expect(optionEvent1).toHaveBeenCalledWith(true);

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('label2'));
    expect(optionEvent2).toHaveBeenCalledTimes(1);
    expect(optionEvent2).toHaveBeenCalledWith(true);
    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label3'));
    expect(optionEvent3).toHaveBeenCalledTimes(1);
    expect(optionEvent3).toHaveBeenCalledWith(true);
    expect(screen.getByText('label3').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label3'));
    expect(optionEvent3).toHaveBeenCalledTimes(2);
    expect(optionEvent3).toHaveBeenCalledWith(false);
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

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('value1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('value2')).toBeInTheDocument();
  });

  it('render snapshot with disabled props is equal true', () => {
    expect(
      superRender(<ToggleTokens options={list_1} disabled />)
    ).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));

    expect(screen.getByText('key2').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('key2').parentNode).toHaveClass(
      'toggle-token-item-button-disabled'
    );

    cleanup();

    expect(
      superRender(<ToggleTokens options={list_2} disabled noStyle />)
    ).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));
    expect(optionEvent1).toHaveBeenCalledTimes(0);
    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-no-style-disabled'
    );
  });
});

describe('test ToggleTokens/multiple', () => {
  it('render snapshot with Array<string> type options', () => {
    const { container } = superRender(
      <ToggleTokens options={list_1} multiple withCheckbox />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key1'));

    expect(screen.getByText('key1').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode?.parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').parentNode?.parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('key2'));
    expect(screen.getByText('key1').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key1').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key3').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('key3'));
    expect(screen.getByText('key1').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('key2').parentNode?.parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
  });

  it('render snapshot with Array<object> type options', () => {
    const { container } = superRender(
      <ToggleTokens options={list_2} multiple />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('label1'));

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('label2'));
    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    fireEvent.click(screen.getByText('label3'));

    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label3').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label3'));
    expect(screen.getByText('label1').parentNode).toHaveClass(
      'toggle-token-item-checked'
    );
    expect(screen.getByText('label2').parentNode).toHaveClass(
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

    expect(screen.getByText('label1').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );

    fireEvent.click(screen.getByText('label2'));

    expect(screen.getByText('label2').parentNode).not.toHaveClass(
      'toggle-token-item-checked'
    );
    expect(container).toMatchSnapshot();
  });
});
