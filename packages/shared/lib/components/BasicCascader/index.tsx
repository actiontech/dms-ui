import { CascaderProps, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { ComponentControlHeight } from '../../data/common';
import BasicEmpty from '../BasicEmpty';
import { CloseOutlined } from '@actiontech/icons';
import { BasicCascaderStyleWrapper } from './style';

const BasicCascader = (props: CascaderProps) => {
  const { t } = useTranslation();
  const { className, allowClear, loading, popupClassName, ...otherParams } =
    props;

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
      <BasicCascaderStyleWrapper
        className={classnames('basic-cascader-wrapper', className)}
        placeholder={t('common.form.placeholder.select')}
        notFoundContent={
          loading ? <BasicEmpty loading={loading} /> : <BasicEmpty />
        }
        {...otherParams}
        clearIcon={<CloseOutlined width={14} height={14} />}
        allowClear={allowClear}
        loading={loading}
      />
    </ConfigProvider>
  );
};

export default BasicCascader;
