import { DashOutlined } from '@actiontech/icons';
import { BasicButton, BasicTag, BasicToolTips } from '@actiontech/shared';
import { IAuditPlanTypeResBase } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Space } from 'antd';
import { Link } from 'react-router-dom';
import { ScanTypeTagsCellStyleWrapper } from './style';

type Props = {
  instanceAuditPlanId: string;
  scanTypes: IAuditPlanTypeResBase[];
};

const ScanTypeTagsCell: React.FC<Props> = ({
  scanTypes,
  instanceAuditPlanId
}) => {
  const { projectID } = useCurrentProject();

  const renderScanTypeTag = (scanType: IAuditPlanTypeResBase) => {
    return (
      <Link
        key={scanType.type}
        to={`/sqle/project/${projectID}/sql-management-conf/${instanceAuditPlanId}?active_audit_plan_id=${scanType.audit_plan_id}`}
      >
        <BasicTag className="pointer">{scanType.desc}</BasicTag>
      </Link>
    );
  };

  const render = () => {
    if (!scanTypes || !scanTypes.length) {
      return '-';
    }

    if (scanTypes.length <= 2) {
      return <>{scanTypes.map((item) => renderScanTypeTag(item))}</>;
    }

    return (
      <>
        {scanTypes.slice(0, 2).map((item) => renderScanTypeTag(item))}
        <BasicToolTips
          trigger={'click'}
          title={
            <Space wrap size={[0, 6]}>
              {scanTypes.map((item) => renderScanTypeTag(item))}
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
    <ScanTypeTagsCellStyleWrapper>{render()}</ScanTypeTagsCellStyleWrapper>
  );
};

export default ScanTypeTagsCell;
