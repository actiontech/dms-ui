import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import useWhitelistRedux from '../../../page/Whitelist/hooks/useWhitelistRedux';
import useRuleExceptionActions from '../useRuleExceptionActions';

export type OpenCreateAuditWhitelistExceptionParams = {
  auditResult?: IAuditResult;
  sqlManageContext?: ISqlManageRuleExceptionContext;
};

type AddRuleExceptionButtonProps = {
  auditResult?: IAuditResult;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onSuccess?: () => void;
  onOpenCreateException?: (
    params: OpenCreateAuditWhitelistExceptionParams
  ) => void;
};

const AddRuleExceptionButton: React.FC<AddRuleExceptionButtonProps> = ({
  auditResult,
  sqlManageContext,
  status,
  onOpenCreateException
}) => {
  const { t } = useTranslation();
  const { canWrite } = useRuleExceptionActions();
  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();

  const hidden = useMemo(() => {
    if (!canWrite) {
      return true;
    }
    if (status === SqlManageStatusEnum.ignored) {
      return true;
    }
    return !auditResult?.rule_name;
  }, [auditResult, canWrite, status]);

  if (hidden) {
    return null;
  }

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onOpenCreateException) {
      onOpenCreateException({ auditResult, sqlManageContext });
      return;
    }

    openAuditWhitelistCreateWithPrefill(
      {
        sql_fingerprint: sqlManageContext?.sql_fingerprint,
        instance_id: sqlManageContext?.instance_id,
        instance_name: sqlManageContext?.instance_name,
        db_type: sqlManageContext?.db_type,
        source: sqlManageContext?.source,
        audit_result: auditResult ? [auditResult] : undefined
      },
      { ruleName: auditResult?.rule_name }
    );
  };

  return (
    <BasicToolTips title={t('ruleException.button.add')}>
      <PlusOutlined
        width={16}
        height={16}
        className="pointer"
        onClick={handleClick}
      />
    </BasicToolTips>
  );
};

export default AddRuleExceptionButton;
