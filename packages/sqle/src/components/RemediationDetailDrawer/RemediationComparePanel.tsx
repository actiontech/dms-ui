import { Space } from 'antd';
import { ISqlManageRemediation } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlManageRuleExceptionContext } from '../../page/RuleException/index.data';
import RemediationDiffCompare from './RemediationDiffCompare';
import { SkippedRuleExceptionTable } from '../RuleException';

export type RemediationComparePanelProps = {
  data?: ISqlManageRemediation;
  sqlManageId?: number | string;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
};

const RemediationComparePanel: React.FC<RemediationComparePanelProps> = ({
  data,
  sqlManageId,
  sqlManageContext,
  status,
  onRefresh
}) => {
  return (
    <Space direction="vertical" size={24} className="full-width-element">
      <RemediationDiffCompare
        data={data}
        sqlManageId={sqlManageId}
        sqlManageContext={sqlManageContext}
        status={status}
        onRefresh={onRefresh}
      />
      <SkippedRuleExceptionTable
        dataSource={data?.skipped_by_rule_exception}
        sqlManageContext={sqlManageContext}
        onRefresh={onRefresh}
      />
    </Space>
  );
};

export default RemediationComparePanel;
