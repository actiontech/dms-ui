import { useTranslation } from 'react-i18next';
import { TableSearchInputProps } from '../index.type';
import { SearchOutlined } from '@actiontech/icons';
import classnames from 'classnames';
import { SearchInputStyleWrapper } from './style';
import { useKeyPress } from 'ahooks';

const SearchInput: React.FC<TableSearchInputProps> = ({
  onChange,
  className,
  onSearch,
  ...props
}) => {
  const { t } = useTranslation();

  useKeyPress('enter', () => onSearch?.(), {
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
        onChange?.(e.target.value);
      }}
      suffix={
        <SearchOutlined width={14} height={14} onClick={() => onSearch?.()} />
      }
      {...props}
    />
  );
};

export default SearchInput;
