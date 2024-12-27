import { BasicButton, Copy } from '@actiontech/shared';
import { ToggleButtonStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';

export const CopySqlAction = ({ sql }: { sql: string }) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const handleCopySql = () => {
    Copy.copyTextByTextarea(sql);
    messageApi.success(t('common.copied'));
  };
  return (
    <>
      {messageContextHolder}
      <BasicButton onClick={handleCopySql}>{t('sqlRewrite.copy')}</BasicButton>
    </>
  );
};

export const ShowSqlDifferenceAction = ({
  showSqlDifference,
  toggleShowSqlDifference
}: {
  showSqlDifference: boolean;
  toggleShowSqlDifference: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <ToggleButtonStyleWrapper
      className="toggle-button-wrapper"
      onClick={toggleShowSqlDifference}
      active={showSqlDifference}
    >
      {t('sqlRewrite.viewDifferences')}
    </ToggleButtonStyleWrapper>
  );
};

export const ShowExecuteOrderExplanationAction = ({
  showExecuteOrderExplanation,
  toggleShowExecuteOrderExplanation
}: {
  showExecuteOrderExplanation: boolean;
  toggleShowExecuteOrderExplanation: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <ToggleButtonStyleWrapper
      className="toggle-button-wrapper"
      onClick={toggleShowExecuteOrderExplanation}
      active={showExecuteOrderExplanation}
    >
      {t('sqlRewrite.viewExecuteOrderExplanation')}
    </ToggleButtonStyleWrapper>
  );
};
