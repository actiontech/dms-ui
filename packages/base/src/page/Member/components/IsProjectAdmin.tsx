import { useTranslation } from 'react-i18next';
import { IconMemberIsAdmin, IconMemberNotAdmin } from '../../../icon/member';
import { TableColumnWithIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const IsProjectAdmin: React.FC<{ value: boolean }> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <TableColumnWithIconStyleWrapper>
      {value ? (
        <>
          <IconMemberIsAdmin />
          <span>{t('common.true')}</span>
        </>
      ) : (
        <>
          <IconMemberNotAdmin />
          <span>{t('common.false')}</span>
        </>
      )}
    </TableColumnWithIconStyleWrapper>
  );
};

export default IsProjectAdmin;
