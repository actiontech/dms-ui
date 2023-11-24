import { TableToolbarProps } from '../index.type';
import ColumnsSetting from './ColumnsSetting';
import { Space, Spin, ConfigProvider } from 'antd';
import useTableAction from '../hooks/useTableAction';
import FilterButton from './FilterButton';
import RefreshButton from './RefreshButton';
import SearchInput from './SearchInput';
import classnames from 'classnames';
import { ToolbarStyleWrapper } from './style';

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
  loading = false
}: TableToolbarProps<T>) => {
  const { renderAction } = useTableAction();
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 13
        }
      }}
    >
      <Spin spinning={loading} delay={300}>
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
            {!!setting && <ColumnsSetting<T> {...setting} />}
            {!!refreshButton && <RefreshButton {...refreshButton} />}
          </Space>
        </ToolbarStyleWrapper>
      </Spin>
    </ConfigProvider>
  );
};

export default ToolBar;
