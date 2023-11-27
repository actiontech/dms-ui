import { useTranslation } from 'react-i18next';
import { TableSearchInputProps } from '../index.type';
import { IconSearch } from '../../../Icon/common';
import classnames from 'classnames';
import { SearchInputStyleWrapper } from './style';
import { useKeyPress } from 'ahooks';

const SearchInput: React.FC<TableSearchInputProps> = ({
  onSearch,
  className,
  onRefresh,
  ...props
}) => {
  const { t } = useTranslation();

  useKeyPress('enter', () => onRefresh?.(), {
    target: () => document.getElementById('actiontech-table-search-input')
  });

  return (
    <SearchInputStyleWrapper
      id="actiontech-table-search-input"
      size="small"
      className={classnames(
        'actiontech-table-search-input-namespace',
        className
      )}
      placeholder={t('common.actiontechTable.searchInput.placeholder')}
      onChange={(e) => {
        onSearch?.(e.target.value);
      }}
      suffix={<IconSearch onClick={() => onRefresh?.()} />}
      {...props}
    />
  );
};

export default SearchInput;
