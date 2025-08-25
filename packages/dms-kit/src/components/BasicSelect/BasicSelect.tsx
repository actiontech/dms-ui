import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { BasicSelectStyleWrapper, SelectContainerStyleWrapper } from './style';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import { CloseOutlined } from '@actiontech/icons';
import { BasicSelectProps } from './BasicSelect.types';

const BasicSelect = <V = string,>(props: BasicSelectProps<V>) => {
  const { t } = useTranslation();
  const { className, allowClear, loading, prefix, ...otherParams } = props;

  // TODO: 等后续 antd 升级后移出 prefix 实现
  const selectComponent = (
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
  );

  if (!prefix) {
    return selectComponent;
  }

  return (
    <SelectContainerStyleWrapper className="basic-select-container has-prefix">
      <span className="basic-select-prefix">{prefix}</span>
      {selectComponent}
    </SelectContainerStyleWrapper>
  );
};

export default BasicSelect;
