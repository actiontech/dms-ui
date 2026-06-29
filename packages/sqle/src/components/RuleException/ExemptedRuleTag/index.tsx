import { useTranslation } from 'react-i18next';
import { BasicTag } from '@actiontech/shared';
import useRuleExceptionActions from '../useRuleExceptionActions';

type ExemptedRuleTagProps = {
  exceptionId?: number | null;
  className?: string;
};

const ExemptedRuleTag: React.FC<ExemptedRuleTagProps> = ({
  exceptionId,
  className
}) => {
  const { t } = useTranslation();
  const { navigateToExceptionDetail } = useRuleExceptionActions();

  return (
    <BasicTag
      size="small"
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        navigateToExceptionDetail(exceptionId);
      }}
      style={{ cursor: exceptionId ? 'pointer' : 'default' }}
    >
      {t('ruleException.tag.exempted')}
    </BasicTag>
  );
};

export default ExemptedRuleTag;
