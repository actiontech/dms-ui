import { ConfigProvider, TreeSelectProps } from 'antd';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import { ComponentControlHeight } from '../../data/common';
import BasicEmpty from '../BasicEmpty';
import { CloseOutlined, DownOutlined, RightOutlined } from '@actiontech/icons';
import {
  BasicTreeSelectPopupMenuStyleWrapper,
  BasicTreeSelectStyleWrapper
} from './style';
import { AntTreeNodeProps } from 'antd/es/tree';

const BasicTreeSelect = <V extends string | number>(
  props: TreeSelectProps<V>
) => {
  const { t } = useTranslation();
  const { className, allowClear, loading, popupClassName, ...otherParams } =
    props;

  const renderDropdown: TreeSelectProps['dropdownRender'] = (menu) => {
    const customMenu = (
      <>
        <BasicTreeSelectPopupMenuStyleWrapper>
          {menu}
        </BasicTreeSelectPopupMenuStyleWrapper>
      </>
    );
    if (props.dropdownRender) {
      return props.dropdownRender(customMenu);
    }
    return customMenu;
  };

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
      <BasicTreeSelectStyleWrapper
        className={classnames('basic-tree-select-wrapper', className)}
        placeholder={t('common.form.placeholder.select')}
        notFoundContent={
          loading ? <BasicEmpty loading={loading} /> : <BasicEmpty />
        }
        switcherIcon={({ expanded }: AntTreeNodeProps) => {
          if (expanded) {
            return <DownOutlined color="currentColor" />;
          }
          return <RightOutlined />;
        }}
        {...otherParams}
        clearIcon={<CloseOutlined width={14} height={14} />}
        allowClear={allowClear}
        loading={loading}
        dropdownRender={renderDropdown}
      />
    </ConfigProvider>
  );
};

export default BasicTreeSelect;
