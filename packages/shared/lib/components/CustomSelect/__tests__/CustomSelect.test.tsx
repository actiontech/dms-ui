import { superRender } from '../../../testUtil/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import CustomSelect from '../CustomSelect';
import { CustomSelectProps } from '../CustomSelect.types';
import { getBySelector } from '../../../testUtil/customQuery';

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
    return superRender(<CustomSelect {...params} />);
  };

  it('should render default select and handle search', async () => {
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

    const searchInputEle = getBySelector(
      '.ant-select-selection-search input',
      baseElement
    );
    await act(() => {
      fireEvent.mouseDown(searchInputEle);
      jest.runAllTimers();
    });
    const options = await screen.findAllByText('label1');
    expect(options.length).toBe(1);

    await act(async () => {
      fireEvent.change(searchInputEle, {
        target: { value: '2' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(screen.queryByText('label1')).not.toBeInTheDocument();
    expect(screen.getByText('label2')).toBeInTheDocument();
  });

  it('should handle tags mode and render custom tags', async () => {
    const onChangeFn = jest.fn();
    const { container, baseElement } = customRender({
      className: 'custom-select-class',
      prefix: '前缀',
      mode: 'tags',
      options: [
        { label: 'label1', value: 'value1' },
        { label: 'label2', value: 'value2' }
      ],
      onChange: onChangeFn
    });

    await act(async () => {
      fireEvent.mouseDown(
        getBySelector('.ant-select-selection-search input', baseElement)
      );
      await jest.advanceTimersByTime(300);
    });

    await act(async () => {
      fireEvent.click(screen.getByText('label1'));
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledWith(['value1'], expect.anything());
    expect(container).toMatchSnapshot();

    await act(async () => {
      fireEvent.click(screen.getByText('label2'));
      await jest.advanceTimersByTime(300);
    });
    expect(screen.getByText(', label2')).toBeInTheDocument();
  });
});
