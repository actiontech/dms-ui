import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { PageHeader, BasicButton } from '@actiontech/shared';
import AuthListModal from './components/Modal';
import AuthListItem from './components/List';
import { AuthListStyleWrapper } from './style';

const AuthList: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();
  const navigate = useNavigate();

  return (
    <AuthListStyleWrapper>
      <PageHeader
        title={t('auth.list.title')}
        extra={
          <BasicButton
            type="primary"
            onClick={() => {
              navigate(`/provision/project/${projectID}/auth/list/add`);
            }}
          >
            {t('auth.button.addAuth')}
          </BasicButton>
        }
      />
      <AuthListItem />
      <AuthListModal />
    </AuthListStyleWrapper>
  );
};

export default AuthList;
