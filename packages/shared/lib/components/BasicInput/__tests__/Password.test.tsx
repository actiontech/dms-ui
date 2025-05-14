import { screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/customRender';
import { BasicInput } from '..';

describe('lib/BasicInput/Password', () => {
  const customRender = (params = {}) => {
    return superRender(<BasicInput.Password {...params} />);
  };

  it('should render basic password input with default props', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
    expect(screen.getByPlaceholderText('请输入{{name}}')).toBeInTheDocument();
  });

  it('should render password input with custom className', () => {
    const { container } = customRender({
      className: 'custom-password'
    });
    expect(container.querySelector('.custom-password')).toBeInTheDocument();
    expect(container.querySelector('.basic-input-wrapper')).toBeInTheDocument();
  });

  it('should render password input with different sizes', () => {
    const { rerender, container } = customRender({ size: 'large' });
    expect(container.querySelector('.basic-input-wrapper')).toHaveClass(
      'ant-input-password-large'
    );

    rerender(<BasicInput.Password size="small" />);
    expect(container.querySelector('.basic-input-wrapper')).toHaveClass(
      'ant-input-password-small'
    );

    rerender(<BasicInput.Password size="middle" />);
    expect(container.querySelector('.basic-input-wrapper')).not.toHaveClass(
      'ant-input-password-large',
      'ant-input-password-small'
    );
  });

  it('should render disabled password input', () => {
    const { container } = customRender({ disabled: true });
    expect(
      container.querySelector('.basic-input-wrapper')?.children[0]
    ).toBeDisabled();
  });
});
