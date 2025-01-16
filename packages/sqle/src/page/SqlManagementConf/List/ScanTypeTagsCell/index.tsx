import { DashOutlined } from '@actiontech/icons';
import {
  BasicButton,
  BasicTag,
  BasicToolTip,
  TypedLink
} from '@actiontech/shared';
import { IAuditPlanTypeResBase } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { Space } from 'antd';
import { ScanTypeTagsCellStyleWrapper } from './style';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
      <TypedLink
        key={scanType.type}
        to={ROUTE_PATHS.SQLE.SQL_MANAGEMENT_CONF.detail}
        params={{ projectID, id: instanceAuditPlanId }}
        queries={{
          active_audit_plan_id: scanType.audit_plan_id?.toString() ?? ''
        }}
      >
        <BasicTag className="pointer">{scanType.desc}</BasicTag>
      </TypedLink>
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
        <BasicToolTip
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
        </BasicToolTip>
      </>
    );
  };

  return (
    <ScanTypeTagsCellStyleWrapper>{render()}</ScanTypeTagsCellStyleWrapper>
  );
};

export default ScanTypeTagsCell;
