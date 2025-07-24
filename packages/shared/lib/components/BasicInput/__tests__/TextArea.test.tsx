import { screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/superRender';
import { BasicInput } from '..';

describe('lib/BasicInput/TextArea', () => {
  const customRender = (params = {}) => {
    return superRender(<BasicInput.TextArea {...params} />);
  };

  it('should render basic textarea with default props', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
    expect(screen.getByPlaceholderText('请输入{{name}}')).toBeInTheDocument();
  });

  it('should render textarea with custom className', () => {
    const { container } = customRender({
      className: 'custom-textarea'
    });
    expect(container.querySelector('.custom-textarea')).toBeInTheDocument();
    expect(container.querySelector('.basic-input-wrapper')).toBeInTheDocument();
  });

  it('should render textarea with different sizes', () => {
    const { rerender } = customRender({ size: 'large' });
    expect(screen.getByRole('textbox')).toHaveClass('ant-input-lg');

    rerender(<BasicInput.TextArea size="small" />);
    expect(screen.getByRole('textbox')).toHaveClass('ant-input-sm');

    rerender(<BasicInput.TextArea size="middle" />);
    expect(screen.getByRole('textbox')).not.toHaveClass(
      'ant-input-lg',
      'ant-input-sm'
    );
  });

  it('should render disabled textarea', () => {
    customRender({ disabled: true });
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should render textarea with error status', () => {
    const { container } = customRender({ status: 'error' });
    expect(
      container.querySelector('.ant-input-status-error')
    ).toBeInTheDocument();
  });

  it('should render textarea with custom rows', () => {
    customRender({ rows: 5 });
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('should render textarea with maxLength and show count', () => {
    const { container } = customRender({
      maxLength: 100,
      showCount: true
    });
    expect(
      container.querySelector('.ant-input-data-count')
    ).toBeInTheDocument();
  });
});
