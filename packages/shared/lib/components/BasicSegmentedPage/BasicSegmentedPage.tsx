import BasicSegmented from '../BasicSegmented';
import { BasicSegmentedPageProps } from './index.type';
import {
  SearchInput,
  TableRefreshButton,
  TableFilterButton
} from '../ActiontechTable';
import { Space } from 'antd';
import { ToolbarStyleWrapper } from '../ActiontechTable/components/style';

const BasicSegmentedPage: React.FC<BasicSegmentedPageProps> = ({
  renderContent,
  searchInput,
  refreshButton,
  filterButton,
  ...otherProps
}) => {
  return (
    <>
      <ToolbarStyleWrapper className="full-width-element flex-space-between">
        <Space size={12}>
          <BasicSegmented {...otherProps} />
          {searchInput && <SearchInput {...searchInput} />}
          {filterButton && <TableFilterButton {...filterButton} />}
        </Space>
        <Space size={12}>
          {!!refreshButton && <TableRefreshButton {...refreshButton} />}
        </Space>
      </ToolbarStyleWrapper>
      {renderContent()}
    </>
  );
};

export default BasicSegmentedPage;
