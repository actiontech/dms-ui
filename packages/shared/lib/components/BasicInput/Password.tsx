import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';
import classnames from 'classnames';
import { StyleComponent } from './style';
import { InputRef, PasswordProps } from 'antd/es/input';

const Wrapper = StyleComponent('Password');

const InternalPassword: React.ForwardRefRenderFunction<
  InputRef,
  PasswordProps
> = (props, ref) => {
  const { t } = useTranslation();
  const { className, ...otherParams } = props;

  return (
    <Wrapper
      className={classnames('basic-input-wrapper', className)}
      ref={ref}
      placeholder={t('common.form.placeholder.input')}
      {...otherParams}
    />
  );
};

export default forwardRef(InternalPassword);
