import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicToolTips } from '@actiontech/shared';
import { PlusOutlined } from '@actiontech/icons';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditResultWithExemption } from '../../../page/RuleException/index.type';
import { ISqlManageRuleExceptionContext } from '../../../page/RuleException/index.data';
import QuickAddRuleExceptionModal from '../QuickAddRuleExceptionModal';
import useRuleExceptionActions from '../useRuleExceptionActions';

export type OpenCreateSqlManagementExceptionParams = {
  auditResult?: IAuditResultWithExemption;
  sqlManageContext?: ISqlManageRuleExceptionContext;
};

type AddRuleExceptionButtonProps = {
  auditResult?: IAuditResultWithExemption;
  sqlManageContext?: ISqlManageRuleExceptionContext;
  status?: SqlManageStatusEnum | string;
  onSuccess?: () => void;
  onOpenCreateException?: (
    params: OpenCreateSqlManagementExceptionParams
  ) => void;
};

const AddRuleExceptionButton: React.FC<AddRuleExceptionButtonProps> = ({
  auditResult,
  sqlManageContext,
  status,
  onSuccess,
  onOpenCreateException
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { canWrite } = useRuleExceptionActions({ sqlManageContext });

  const hidden = useMemo(() => {
    if (!canWrite) {
      return true;
    }
    if (status === SqlManageStatusEnum.ignored) {
      return true;
    }
    if (auditResult?.is_exempted) {
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
    setOpen(true);
  };

  return (
    <>
      <BasicToolTips title={t('ruleException.button.add')}>
        <PlusOutlined
          width={16}
          height={16}
          className="pointer"
          onClick={handleClick}
        />
      </BasicToolTips>
      {!onOpenCreateException ? (
        <QuickAddRuleExceptionModal
          open={open}
          ruleName={auditResult?.rule_name}
          auditResult={auditResult}
          sqlManageContext={sqlManageContext}
          onClose={() => setOpen(false)}
          onSuccess={onSuccess}
        />
      ) : null}
    </>
  );
};

export default AddRuleExceptionButton;
