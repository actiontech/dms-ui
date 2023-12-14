import BasicSegmented from '../BasicSegmented';
import { BasicSegmentedPageProps } from './index.type';
import { SearchInput } from '../ActiontechTable';
import { Space } from 'antd';
import { ToolbarStyleWrapper } from '../ActiontechTable/components/style';

const BasicSegmentedPage: React.FC<BasicSegmentedPageProps> = ({
  renderContent,
  searchInput,
  ...otherProps
}) => {
  return (
    <>
      <ToolbarStyleWrapper>
        <Space size={12}>
          <BasicSegmented {...otherProps} />
          {searchInput && <SearchInput {...searchInput} />}
        </Space>
      </ToolbarStyleWrapper>
      {renderContent()}
    </>
  );
};

export default BasicSegmentedPage;
