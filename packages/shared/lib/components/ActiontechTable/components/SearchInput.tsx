import { useTranslation } from 'react-i18next';
import { TableSearchInputProps } from '../index.type';
import { IconSearch } from '../../../Icon/common';
import { useState } from 'react';
import classnames from 'classnames';
import { SearchInputStyleWrapper } from './style';
import { useKeyPress } from 'ahooks';

const SearchInput: React.FC<TableSearchInputProps> = ({
  onSearch,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  useKeyPress('enter', () => onSearch?.(searchValue), {
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
        setSearchValue(e.target.value);
      }}
      suffix={<IconSearch onClick={() => onSearch?.(searchValue)} />}
      {...props}
    />
  );
};

export default SearchInput;
