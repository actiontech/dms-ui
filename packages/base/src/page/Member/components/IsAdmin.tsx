import { useTranslation } from 'react-i18next';
import { IconMemberIsAdmin, IconMemberNotAdmin } from '../../../icon/member';
import { MemberListIsAdminStyledWrapper } from '../style';

const IsAdmin: React.FC<{ value: boolean }> = ({ value }) => {
  const { t } = useTranslation();

  return (
    <MemberListIsAdminStyledWrapper>
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
    </MemberListIsAdminStyledWrapper>
  );
};

export default IsAdmin;
