import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import GlobalStyles from '@mui/material/GlobalStyles';
import { BasicSelectStyleWrapper, SelectContainerStyleWrapper } from './style';
import BasicEmpty from '../BasicEmpty/BasicEmpty';
import { CloseOutlined } from '@actiontech/icons';
import { BasicSelectProps } from './BasicSelect.types';
import { ENVIRONMENT_TAG_SELECT_DROPDOWN_CLASS_NAME } from './environmentTagSelectProps';

const environmentTagSelectGlobalStyles = {
  [`.${ENVIRONMENT_TAG_SELECT_DROPDOWN_CLASS_NAME}`]: {
    minWidth: 'max-content'
  },
  [`.${ENVIRONMENT_TAG_SELECT_DROPDOWN_CLASS_NAME} .ant-select-item-option-content`]:
    {
      overflow: 'visible',
      whiteSpace: 'nowrap'
    }
};

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
    return (
      <>
        <GlobalStyles styles={environmentTagSelectGlobalStyles} />
        {selectComponent}
      </>
    );
  }

  return (
    <>
      <GlobalStyles styles={environmentTagSelectGlobalStyles} />
      <SelectContainerStyleWrapper className="basic-select-container has-prefix">
        <span className="basic-select-prefix">{prefix}</span>
        {selectComponent}
      </SelectContainerStyleWrapper>
    </>
  );
};

export default BasicSelect;
