import { useTranslation } from 'react-i18next';
import { FormAreaLineStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { BriefcaseFilled } from '@actiontech/icons';
import VersionBaseInfo from './BaseInfo';
import DeploymentConf from './DeploymentConf';
import { VersionFormAreaBlockStyleWrapper } from './style';

const VersionForm: React.FC<{
  isUpdate?: boolean;
  allowEditStages?: boolean;
}> = ({ isUpdate = false, allowEditStages = true }) => {
  const { t } = useTranslation();

  return (
    <>
      <FormAreaLineStyleWrapper>
        <VersionFormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <BriefcaseFilled width={42} height={40} className="title-icon" />
            {isUpdate
              ? t('versionManagement.update.title')
              : t('versionManagement.create.title')}
          </FormItemBigTitle>
          <VersionBaseInfo />
          <DeploymentConf allowEditStages={allowEditStages} />
        </VersionFormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </>
  );
};

export default VersionForm;
