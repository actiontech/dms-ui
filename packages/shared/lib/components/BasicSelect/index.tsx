import { ConfigProvider, SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { IconClose } from '../../Icon';
import classnames from 'classnames';
import { BasicSelectStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';
import BasicEmpty from '../BasicEmpty';

const BasicSelect = <V = any,>(props: SelectProps<V>) => {
  const { t } = useTranslation();
  const { className, allowClear, loading, ...otherParams } = props;

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
        notFoundContent={
          loading ? <BasicEmpty loading={loading} /> : <BasicEmpty />
        }
        {...otherParams}
        clearIcon={<IconClose />}
        allowClear={allowClear}
        loading={loading}
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
