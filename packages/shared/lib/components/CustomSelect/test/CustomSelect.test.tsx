import { renderWithTheme } from '../../../testUtil/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';

import CustomSelect from '../CustomSelect';
import { CustomSelectProps } from '../index.type';
import { getAllBySelector, getBySelector } from '../../../testUtil/customQuery';

describe('lib/CustomSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: CustomSelectProps) => {
    return renderWithTheme(<CustomSelect {...params} />);
  };

  it('should render default select', async () => {
    const { container, baseElement } = customRender({
      prefix: '前缀文本',
      placeholder: '自定义placeholder',
      options: [
        {
          label: 'label1',
          value: 'value1'
        },
        {
          label: 'label2',
          value: 'value2'
        }
      ],
      style: { width: 200 }
    });
    expect(container).toMatchSnapshot();

    const mouseDownEle = getBySelector('.ant-select-arrow', baseElement);
    await act(async () => {
      fireEvent.mouseDown(mouseDownEle);
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();

    const searchInputEle = getBySelector(
      '.ant-select-selection-search input',
      baseElement
    );
    await act(() => {
      fireEvent.mouseDown(searchInputEle);
      jest.runAllTimers();
    });
    await screen.findAllByText('label1');
    expect(container).toMatchSnapshot();
    await act(async () => {
      fireEvent.change(searchInputEle, {
        target: { value: '2' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();
  });

  it('should show change options', async () => {
    const onChangeFn = jest.fn();
    const { container, baseElement } = customRender({
      className: 'custom-select-class',
      placeholder: '自定义placeholder',
      allowClear: false,
      size: 'middle',
      mode: 'tags',
      options: [
        {
          label: 'label1',
          value: 'value1'
        },
        {
          label: 'label2',
          value: 'value2'
        }
      ],
      onChange: onChangeFn
    });
    expect(container).toMatchSnapshot();

    await act(async () => {
      fireEvent.mouseDown(
        getBySelector('.ant-select-selection-search input', baseElement)
      );
      await jest.advanceTimersByTime(300);
    });
    expect(getAllBySelector('.ant-select-item', baseElement).length).toBe(2);
    await act(async () => {
      fireEvent.click(screen.getByText('label1'));
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();
  });

  it('should render when optionCustomLabel is true', async () => {
    const { baseElement } = customRender({
      className: 'custom-select-class',
      placeholder: '自定义placeholder',
      prefix: 'isRenderLabel',
      allowClear: false,
      optionCustomLabel: (optionVal) => (
        <span>
          {optionVal.text}
          {optionVal.value}
        </span>
      ),
      size: 'middle',
      mode: 'tags',
      options: [
        {
          label: <span style={{ color: 'red' }}>label-test</span>,
          text: '111',
          value: 'value1'
        }
      ]
    });
    await act(async () => {
      fireEvent.mouseDown(
        getBySelector('.ant-select-selection-search input', baseElement)
      );
      await jest.advanceTimersByTime(300);
    });
    expect(getAllBySelector('.ant-select-item', baseElement).length).toBe(1);
    await act(async () => {
      fireEvent.click(screen.getByText('label-test'));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
