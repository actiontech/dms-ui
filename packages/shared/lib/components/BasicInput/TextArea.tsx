import { ConfigProvider } from 'antd5';
import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';
import classnames from 'classnames';
import { StyleComponent } from './style';
import { ComponentControlHeight } from '../../data/common';
import { TextAreaProps } from 'antd5/es/input';
import { TextAreaRef } from 'antd5/es/input/TextArea';

const Wrapper = StyleComponent('TextArea');

const InternalTextArea: React.ForwardRefRenderFunction<
  TextAreaRef,
  TextAreaProps
> = (props, ref) => {
  const { t } = useTranslation();
  const { children, className, allowClear, ...otherParams } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            controlHeight: ComponentControlHeight.default,
            controlHeightLG: ComponentControlHeight.lg,
            controlHeightSM: ComponentControlHeight.sm
          }
        }
      }}
    >
      <Wrapper
        className={classnames('basic-input-wrapper', className)}
        ref={ref}
        placeholder={t('common.form.placeholder.input')}
        {...otherParams}
      />
    </ConfigProvider>
  );
};

export default forwardRef(InternalTextArea);
