import { DashOutlined } from '@actiontech/icons';
import { BasicButton, BasicTag, BasicToolTips } from '@actiontech/shared';
import { Space } from 'antd';
import { DataPermissionsTagsCellStyleWrapper } from './style';

type Props = {
  dataPermissions: string[];
};

const DATA_PERMISSION_TAGS_LIMIT = 6;

const DataPermissionsTagsCell: React.FC<Props> = ({ dataPermissions }) => {
  const renderScanTypeTag = (permission: string) => {
    return <BasicTag className="pointer">{permission}</BasicTag>;
  };

  const render = () => {
    if (!dataPermissions || !dataPermissions.length) {
      return '-';
    }

    if (dataPermissions.length <= DATA_PERMISSION_TAGS_LIMIT) {
      return <>{dataPermissions.map((item) => renderScanTypeTag(item))}</>;
    }

    return (
      <>
        {dataPermissions
          .slice(0, DATA_PERMISSION_TAGS_LIMIT)
          .map((item) => renderScanTypeTag(item))}
        <BasicToolTips
          trigger={'click'}
          titleWidth={450}
          title={
            <Space wrap size={[0, 6]}>
              {dataPermissions.map((item) => renderScanTypeTag(item))}
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

export default DataPermissionsTagsCell;
