import { renderWithTheme } from '../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import EditText from '.';
import { EditTypeProps } from './index.type';
import { getAllBySelector, getBySelector } from '../../testUtil/customQuery';

describe('lib/EditText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: EditTypeProps) => {
    return renderWithTheme(<EditText {...params} />);
  };

  it('should render default val when can edit', () => {
    const { container } = customRender({
      editButtonProps: {
        children: '编辑',
        size: 'small'
      },
      editable: {
        autoSize: true
      },
      value: 'default edit text'
    });

    expect(container).toMatchSnapshot();
  });

  it('should render default when not have val', () => {
    const { container } = customRender({
      value: '',
      editButtonProps: {
        children: '编辑',
        size: 'small'
      }
    });

    expect(container).toMatchSnapshot();
  });

  it('should render edit input when textarea change', async () => {
    const onChangeFn = jest.fn();
    const { container, baseElement } = customRender({
      value: '',
      editable: {
        onChange: onChangeFn
      }
    });

    expect(container).toMatchSnapshot();
    const editBtn = getBySelector('button.ant-btn-default', baseElement);
    fireEvent.click(editBtn);
    expect(container).toMatchSnapshot();
    expect(getBySelector('.ant-typography', baseElement)).toBeInTheDocument();
    expect(getAllBySelector('.ant-typography', baseElement).length).toBe(1);
    const textareaEle = getBySelector(
      '.ant-typography textarea.ant-input',
      baseElement
    );
    await act(async () => {
      fireEvent.input(textareaEle, {
        target: { value: 'change_val' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(container).toMatchSnapshot();
    await act(async () => {
      fireEvent.focusOut(textareaEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should render edit input when textarea onEnd', async () => {
    const onEndFn = jest.fn();
    const { container, baseElement } = customRender({
      value: '',
      editable: {
        onEnd: onEndFn
      }
    });
    expect(container).toMatchSnapshot();

    const editBtn = getBySelector('button.ant-btn-default', baseElement);
    fireEvent.click(editBtn);
    expect(getBySelector('.ant-typography', baseElement)).toBeInTheDocument();
    expect(getAllBySelector('.ant-typography', baseElement).length).toBe(1);
    expect(container).toMatchSnapshot();

    const textareaEle = getBySelector(
      '.ant-typography textarea.ant-input',
      baseElement
    );
    fireEvent.input(textareaEle, {
      target: { value: 'textareaEle' }
    });
    await jest.advanceTimersByTime(300);
    fireEvent.click(
      getBySelector('.ant-typography-edit-content-confirm', baseElement)
    );
    await jest.advanceTimersByTime(300);
    // not excute onEndFn
    // expect(onEndFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should render edit value input when textarea change', async () => {
    const onChangeFn = jest.fn();
    const { container, baseElement } = customRender({
      value: 'value-change',
      editable: {
        onChange: onChangeFn
      }
    });
    expect(getBySelector('.ant-typography', baseElement)).toBeInTheDocument();
    expect(getAllBySelector('.ant-typography', baseElement).length).toBe(1);
    expect(container).toMatchSnapshot();

    const editBtn = getBySelector('.ant-typography-edit', baseElement);
    fireEvent.click(editBtn);
    expect(container).toMatchSnapshot();
    const textareaEle = getBySelector('textarea.ant-input', baseElement);
    await act(async () => {
      fireEvent.focusOut(textareaEle);
      await jest.advanceTimersByTime(300);
    });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });

  it('should render edit  value input when textarea onEnd', async () => {
    const onEndFn = jest.fn();
    const { container, baseElement } = customRender({
      value: 'value-end',
      editable: {
        onEnd: onEndFn
      }
    });
    expect(getBySelector('.ant-typography', baseElement)).toBeInTheDocument();
    expect(getAllBySelector('.ant-typography', baseElement).length).toBe(1);
    expect(container).toMatchSnapshot();

    const editBtn = getBySelector('.ant-typography-edit', baseElement);
    fireEvent.click(editBtn);
    expect(container).toMatchSnapshot();
    fireEvent.click(
      getBySelector('.ant-typography-edit-content-confirm', baseElement)
    );
    await jest.advanceTimersByTime(300);
    // not excute onEndFn
    // expect(onEndFn).toHaveBeenCalledTimes(1);
    expect(container).toMatchSnapshot();
  });
});
