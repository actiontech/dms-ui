import { fireEvent } from '@testing-library/react';
import FormPasswordWithPlaceholder, {
  PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE
} from '../FormPasswordWithPlaceholder';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { superRender } from '../../../testUtils/customRender';

describe('FormPasswordWithPlaceholder', () => {
  const defaultProps = {
    enabled: true
  };

  it('should display the default value when enabled and no value is provided', () => {
    superRender(<FormPasswordWithPlaceholder {...defaultProps} />);
    expect(getBySelector('.ant-input')).toHaveAttribute(
      'value',
      PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE
    );
  });

  it('should display the value when value is provided', () => {
    superRender(
      <FormPasswordWithPlaceholder {...defaultProps} value="default value" />
    );
    expect(getBySelector('.ant-input')).toHaveAttribute(
      'value',
      'default value'
    );
  });

  it('should clear the value on focus when enabled', () => {
    const { baseElement } = superRender(
      <FormPasswordWithPlaceholder {...defaultProps} />
    );
    const input = getBySelector('.ant-input');
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.ant-input')).toHaveAttribute(
      'value',
      PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE
    );
    fireEvent.focus(input);
    expect(getBySelector('.ant-input')).toHaveAttribute('value', '');
    expect(baseElement).toMatchSnapshot();
  });

  it('should reset to default value on blur when value is empty and enabled', () => {
    superRender(<FormPasswordWithPlaceholder {...defaultProps} />);
    fireEvent.focus(getBySelector('.ant-input'));
    fireEvent.blur(getBySelector('.ant-input'));
    expect(getBySelector('.ant-input')).toHaveAttribute(
      'value',
      PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE
    );
  });

  it('should update the value and call onChange when user types', () => {
    const onChange = jest.fn();
    superRender(
      <FormPasswordWithPlaceholder {...defaultProps} onChange={onChange} />
    );

    fireEvent.change(getBySelector('.ant-input'), {
      target: { value: 'new value' }
    });
    expect(onChange.mock.calls[0][0].target.value).toBe('new value');
  });

  it('should not react to focus or blur events when disabled', () => {
    const { baseElement } = superRender(
      <FormPasswordWithPlaceholder {...defaultProps} disabled={true} />
    );
    expect(baseElement).toMatchSnapshot();
    const input = getBySelector('.ant-input');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveAttribute(
      'value',
      PASSWORD_TYPE_FIELD_PLACEHOLDER_VALUE
    );
  });

  it('should not display the default placeholder or react to focus/blur when not enabled', () => {
    superRender(<FormPasswordWithPlaceholder enabled={false} />);
    const input = getBySelector('.ant-input');

    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveAttribute('value', '');
  });
});
