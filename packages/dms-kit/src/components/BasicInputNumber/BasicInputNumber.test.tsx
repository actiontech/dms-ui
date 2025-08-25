import { superRender } from '../../testUtil/superRender';
import { fireEvent } from '@testing-library/react';
import BasicInputNumber from './BasicInputNumber';
import { BasicInputNumberProps } from './BasicInputNumber.types';

describe('lib/BasicInputNumber', () => {
  const customRender = (params: BasicInputNumberProps = {}) => {
    return superRender(<BasicInputNumber {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender();
    expect(container).toMatchSnapshot();
  });

  it('should render basic input number with default props', () => {
    const { container } = customRender();
    expect(
      container.querySelector('.basic-inputNumber-wrapper')
    ).toBeInTheDocument();
    expect(container.querySelector('.ant-input-number-lg')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const { container } = customRender({
      className: 'custom-input-number-class'
    });
    expect(
      container.querySelector('.custom-input-number-class')
    ).toBeInTheDocument();
  });

  it('should handle value change correctly', () => {
    const handleChange = jest.fn();
    const { container } = customRender({
      onChange: handleChange,
      min: 0,
      max: 100
    });

    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '50' } });
    expect(handleChange).toHaveBeenCalledWith(50);
  });

  it('should handle disabled state correctly', () => {
    const { container } = customRender({
      disabled: true
    });
    expect(
      container.querySelector('.ant-input-number-disabled')
    ).toBeInTheDocument();
  });
});
