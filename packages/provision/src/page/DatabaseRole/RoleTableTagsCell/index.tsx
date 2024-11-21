import { DashOutlined } from '@actiontech/icons';
import { BasicButton, BasicTag, BasicToolTips } from '@actiontech/shared';
import { Space } from 'antd';
import { DataPermissionsTagsCellStyleWrapper } from './style';

type Props = {
  dataSource: string[];
  tagLimit?: number;
};

const DATA_PERMISSION_TAGS_LIMIT = 4;

const RoleTableTagsCell: React.FC<Props> = ({
  dataSource,
  tagLimit = DATA_PERMISSION_TAGS_LIMIT
}) => {
  const renderScanTypeTag = (permission: string) => {
    return <BasicTag className="pointer">{permission}</BasicTag>;
  };

  const render = () => {
    if (!dataSource || !dataSource.length) {
      return '-';
    }

    if (dataSource.length <= DATA_PERMISSION_TAGS_LIMIT) {
      return <>{dataSource.map((item) => renderScanTypeTag(item))}</>;
    }

    return (
      <>
        {dataSource
          .slice(0, DATA_PERMISSION_TAGS_LIMIT)
          .map((item) => renderScanTypeTag(item))}
        <BasicToolTips
          trigger={'click'}
          titleWidth={450}
          title={
            <Space wrap size={[0, 6]}>
              {dataSource.map((item) => renderScanTypeTag(item))}
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

  return (
    <DataPermissionsTagsCellStyleWrapper>
      {render()}
    </DataPermissionsTagsCellStyleWrapper>
  );
};

export default RoleTableTagsCell;
