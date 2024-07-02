import { useTranslation } from 'react-i18next';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { CheckHexagonOutlined, CloseHexagonOutlined } from '@actiontech/icons';

const IsProjectAdmin: React.FC<{ value: boolean }> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <TableColumnWithIconStyleWrapper>
      {value ? (
        <>
          <CheckHexagonOutlined />
          <span>{t('common.true')}</span>
        </>
      ) : (
        <>
          <CloseHexagonOutlined />
          <span>{t('common.false')}</span>
        </>
      )}
    </TableColumnWithIconStyleWrapper>
  );
};

export default IsProjectAdmin;
