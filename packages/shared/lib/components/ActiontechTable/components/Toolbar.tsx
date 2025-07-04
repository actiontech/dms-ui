import { TableToolbarProps } from '../index.type';
import ColumnsSetting from './ColumnsSetting';
import { Space, Spin } from 'antd';
import useTableAction from '../hooks/useTableAction';
import FilterButton from './FilterButton';
import RefreshButton from './RefreshButton';
import SearchInput from './SearchInput';
import classnames from 'classnames';
import { ToolbarStyleWrapper } from './style';
import { useContext } from 'react';
import { ActiontechTableContext } from '../context';

const ToolBar = <T extends Record<string, any>>({
  children,
  setting = false,
  searchInput,
  filterButton,
  refreshButton,
  actions,
  className = '',
  noStyle = false,
  style,
  loading
}: TableToolbarProps<T>) => {
  const { renderAction } = useTableAction();

  const tableContextValue = useContext(ActiontechTableContext);

  const columnsSetting = tableContextValue?.setting ?? setting;

  const render = () => {
    return (
      <ToolbarStyleWrapper
        className={classnames(className, {
          'full-width-element flex-space-between actiontech-table-toolbar-namespace':
            !noStyle
        })}
        style={style}
        wrap
      >
        <Space size={12}>
          {children}
          {searchInput && <SearchInput {...searchInput} />}
          {filterButton && <FilterButton {...filterButton} />}
        </Space>

        <Space size={12}>
          {!!actions && renderAction(actions)}
          {!!columnsSetting && <ColumnsSetting<T> {...columnsSetting} />}
          {!!refreshButton && <RefreshButton {...refreshButton} />}
        </Space>
      </ToolbarStyleWrapper>
    );
  };

  if (typeof loading !== 'boolean') {
    return render();
  }

  return (
    <Spin spinning={loading} delay={300}>
      {render()}
    </Spin>
  );
};

export default ToolBar;
