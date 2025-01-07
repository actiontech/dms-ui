import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { BasicSelectStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import { CloseOutlined } from '@actiontech/icons';
import { BasicSelectProps } from './BasicSelect.types';

const BasicSelect = <V = string,>(props: BasicSelectProps<V>) => {
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
        clearIcon={<CloseOutlined width={14} height={14} fill="currentColor" />}
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
