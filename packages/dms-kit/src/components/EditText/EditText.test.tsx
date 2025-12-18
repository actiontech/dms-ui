import { superRender } from '../../testUtil/superRender';
import { fireEvent, act, cleanup } from '@testing-library/react';
import EditText from './EditText';
import { EditTypeProps } from './EditText.types';
import { getBySelector } from '../../testUtil/customQuery';

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
    return superRender(<EditText {...params} />);
  };

  describe('基础渲染', () => {
    it('should render with default value and edit button', () => {
      const { container, baseElement } = customRender({
        editButtonProps: {
          children: '编辑',
          size: 'small'
        },
        editable: {
          autoSize: true
        },
        value: ''
      });

      expect(container).toMatchSnapshot();
      expect(getBySelector('.ant-btn-sm', baseElement)).toHaveTextContent(
        '编 辑'
      );
    });

    it('should render with empty value and custom icon', () => {
      const { baseElement } = customRender({
        value: '',
        editButtonProps: {}
      });

      expect(getBySelector('.custom-icon', baseElement)).toBeInTheDocument();
      expect(getBySelector('button', baseElement)).toHaveClass(
        'has-icon-primary'
      );
    });
  });

  describe('交互功能', () => {
    it('should handle text change and trigger onChange callback', async () => {
      const onChangeFn = jest.fn();
      const { baseElement } = customRender({
        value: '',
        editable: {
          onChange: onChangeFn
        }
      });

      const editBtn = getBySelector('.ant-btn-sm', baseElement);
      fireEvent.click(editBtn);

      const textareaEle = getBySelector(
        '.ant-typography textarea.ant-input',
        baseElement
      );
      fireEvent.change(textareaEle, {
        target: { value: 'new text' }
      });

      await act(async () => {
        fireEvent.keyDown(textareaEle, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        fireEvent.keyUp(textareaEle, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        await act(() => jest.advanceTimersByTime(100));
      });

      expect(onChangeFn).toHaveBeenCalledTimes(1);
      expect(onChangeFn).toHaveBeenCalledWith('new text');
    });
  });
});
