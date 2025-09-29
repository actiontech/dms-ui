import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';
import classnames from 'classnames';
import { StyleComponent } from './style';
import { TextAreaProps } from 'antd/es/input';
import { TextAreaRef } from 'antd/es/input/TextArea';

const Wrapper = StyleComponent('TextArea');

const InternalTextArea: React.ForwardRefRenderFunction<
  TextAreaRef,
  TextAreaProps
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

export default forwardRef(InternalTextArea);
