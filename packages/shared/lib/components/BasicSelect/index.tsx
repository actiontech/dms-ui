import { ConfigProvider, SelectProps } from 'antd5';
import { useTranslation } from 'react-i18next';
import { IconClose } from '../../Icon';
import classnames from 'classnames';
import { BasicSelectStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';

const BasicSelect = <V = any,>(props: SelectProps<V>) => {
  const { t } = useTranslation();
  const { className, allowClear, ...otherParams } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            controlHeight: ComponentControlHeight.default,
            controlHeightLG: ComponentControlHeight.lg,
            controlHeightSM: ComponentControlHeight.sm
          }
        }
      }}
    >
      <BasicSelectStyleWrapper
        className={classnames('basic-select-wrapper', className)}
        placeholder={t('common.form.placeholder.select')}
        {...otherParams}
        clearIcon={<IconClose />}
        allowClear={allowClear}
        //ts checker error
        // allowClear={
        //   !!allowClear
        //     ? {
        //         clearIcon: (
        //           <IconClose  />
        //         )
        //       }
        //     : false
        // }
      />
    </ConfigProvider>
  );
};

export default BasicSelect;
