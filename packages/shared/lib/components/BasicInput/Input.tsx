import { InputProps, ConfigProvider } from 'antd5';
import { useTranslation } from 'react-i18next';
import { InputRef } from 'antd';
import { forwardRef } from 'react';
import { IconClose } from '../../Icon';
import classnames from 'classnames';
import { StyleComponent } from './style';
import { ComponentControlHeight } from '../../data/common';

const Wrapper = StyleComponent('Input');

const InternalInput: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  props,
  ref
) => {
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
        allowClear={
          allowClear
            ? {
                clearIcon: <IconClose />
              }
            : false
        }
      />
    </ConfigProvider>
  );
};

export default forwardRef(InternalInput);
