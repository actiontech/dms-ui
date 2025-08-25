import { BasicButton } from '@actiontech/dms-kit';
import { Copy } from '@actiontech/dms-kit';
import { ToggleButtonStyleWrapper } from '@actiontech/dms-kit';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
export const CopySqlAction = ({
  sql,
  hidden = false
}: {
  sql: string;
  hidden?: boolean;
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const handleCopySql = () => {
    Copy.copyTextByTextarea(sql);
    messageApi.success(t('common.copied'));
  };
  return (
    <>
      {messageContextHolder}
      <BasicButton hidden={hidden} onClick={handleCopySql}>
        {t('sqlRewrite.copy')}
      </BasicButton>
    </>
  );
};
export const ShowSqlDifferenceAction = ({
  showSqlDifference,
  toggleShowSqlDifference,
  hidden = false
}: {
  hidden?: boolean;
  showSqlDifference: boolean;
  toggleShowSqlDifference: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <ToggleButtonStyleWrapper
      hidden={hidden}
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
