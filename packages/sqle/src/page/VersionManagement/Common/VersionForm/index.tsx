import { useTranslation } from 'react-i18next';
import { BriefcaseFilled } from '@actiontech/icons';
import VersionBaseInfo from './BaseInfo';
import DeploymentConf from './DeploymentConf';
import { VersionFormAreaBlockStyleWrapper } from './style';
import { FormAreaLineStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemBigTitle } from '@actiontech/dms-kit';

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
