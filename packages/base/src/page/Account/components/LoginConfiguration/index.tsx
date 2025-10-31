import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import LoginConfigurationModal from './LoginConfigurationModal';
import { systemDictionary } from '../../../Nav/UserGuideModal/data';
import { DefaultLoginPageProps } from '../../index.type';
import { ConfigItem, LabelContent } from '@actiontech/shared';

const LoginConfiguration: React.FC<DefaultLoginPageProps> = ({
  userBaseInfo,
  updateUserInfo
}) => {
  const { t } = useTranslation();

  const [modelVisible, { setTrue: showModel, setFalse: hideModel }] =
    useBoolean(false);

  return (
    <>
      <ConfigItem
        label={
          <LabelContent>
            {t('dmsAccount.loginConfiguration.title')}
          </LabelContent>
        }
        descNode={
          userBaseInfo?.system ? systemDictionary[userBaseInfo.system] : '-'
        }
        showField={showModel}
      />

      <LoginConfigurationModal
        open={modelVisible}
        onClose={hideModel}
        updateUserInfo={updateUserInfo}
      />
    </>
  );
};

export default LoginConfiguration;
