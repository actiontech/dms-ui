import { Space } from 'antd';
import { ISqlManageRemediation } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlManageRuleExceptionContext } from '../../page/RuleException/index.data';
import RemediationDiffCompare from './RemediationDiffCompare';
import { SkippedRuleExceptionTable } from '../RuleException';
import { OpenCreateSqlManagementExceptionParams } from '../RuleException/AddRuleExceptionButton';

export type RemediationComparePanelProps = {
  data?: ISqlManageRemediation;
  sqlManageId?: number | string;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onRefresh?: () => void;
  onOpenCreateException?: (
    params: OpenCreateSqlManagementExceptionParams
  ) => void;
};

const RemediationComparePanel: React.FC<RemediationComparePanelProps> = ({
  data,
  sqlManageId,
  sqlManageContext,
  status,
  onRefresh,
  onOpenCreateException
}) => {
  return (
    <Space direction="vertical" size={24} className="full-width-element">
      <RemediationDiffCompare
        data={data}
        sqlManageId={sqlManageId}
        sqlManageContext={sqlManageContext}
        status={status}
        onRefresh={onRefresh}
        onOpenCreateException={onOpenCreateException}
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
