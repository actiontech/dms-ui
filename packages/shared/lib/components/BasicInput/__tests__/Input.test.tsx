import { fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/superRender';
import { BasicInput } from '..';
import { CloseOutlined } from '@actiontech/icons';

jest.mock('@actiontech/icons', () => ({
  CloseOutlined: jest.fn().mockImplementation(() => <span />)
}));

describe('lib/BasicInput/Input', () => {
  const customRender = (params = {}) => {
    return superRender(<BasicInput {...params} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
    expect(screen.getByPlaceholderText('请输入{{name}}')).toBeInTheDocument();
  });

  it('should render basic input with default props', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
    expect(screen.getByPlaceholderText('请输入{{name}}')).toBeInTheDocument();
  });

  it('should render input with custom className', () => {
    const { container } = customRender({
      className: 'custom-input'
    });
    expect(container.querySelector('.custom-input')).toBeInTheDocument();
    expect(container.querySelector('.basic-input-wrapper')).toBeInTheDocument();
  });

  it('should render input with different sizes', () => {
    const { rerender } = customRender({ size: 'large' });
    expect(screen.getByRole('textbox')).toHaveClass('ant-input-lg');

    rerender(<BasicInput size="small" />);
    expect(screen.getByRole('textbox')).toHaveClass('ant-input-sm');

    rerender(<BasicInput size="middle" />);
    expect(screen.getByRole('textbox')).not.toHaveClass(
      'ant-input-lg',
      'ant-input-sm'
    );
  });

  it('should render input with clear icon when allowClear is true', () => {
    const { container } = customRender({
      allowClear: true,
      value: 'test'
    });
    expect(CloseOutlined).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 14,
        height: 14,
        fill: 'currentColor'
      }),
      expect.anything()
    );
    expect(
      container.querySelector('.ant-input-clear-icon')
    ).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const onChange = jest.fn();
    customRender({ onChange });
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('should render disabled input', () => {
    customRender({ disabled: true });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render input with error status', () => {
    const { container } = customRender({ status: 'error' });
    expect(
      container.querySelector('.ant-input-status-error')
    ).toBeInTheDocument();
  });
});
