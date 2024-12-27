import { DashOutlined } from '@actiontech/icons';
import { BasicButton, BasicTag, BasicToolTips } from '@actiontech/shared';
import { Space } from 'antd';
import { TableTagsCellStyleWrapper } from './style';

type Props = {
  dataSource: string[];
  tagLimit?: number;
};

const TableTagsCell: React.FC<Props> = ({ dataSource, tagLimit = 4 }) => {
  const renderScanTypeTag = (permission: string, key: number) => {
    return (
      <BasicTag className="pointer" key={key}>
        {permission}
      </BasicTag>
    );
  };

  const render = () => {
    if (!dataSource || !dataSource.length) {
      return '-';
    }

    if (dataSource.length <= tagLimit) {
      return (
        <>{dataSource.map((item, index) => renderScanTypeTag(item, index))}</>
      );
    }

    return (
      <>
        {dataSource
          .slice(0, tagLimit)
          .map((item, index) => renderScanTypeTag(item, index))}
        <BasicToolTips
          trigger={'click'}
          title={
            <Space wrap size={[0, 6]}>
              {dataSource.map((item, index) => renderScanTypeTag(item, index))}
            </Space>
          }
        >
          <BasicButton
            size="small"
            className="table-row-scan-types-more-button"
            icon={<DashOutlined />}
          />
        </BasicToolTips>
      </>
    );
  };

  return <TableTagsCellStyleWrapper>{render()}</TableTagsCellStyleWrapper>;
};

export default TableTagsCell;
