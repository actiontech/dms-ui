import { Typography } from 'antd';
import { ProjectBusinessDescriptionStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';

const BusinessDescription = () => {
  const { t } = useTranslation();

  return (
    <ProjectBusinessDescriptionStyleWrapper>
      <Typography.Text>
        {t('dmsProject.businessDescription.title')}
      </Typography.Text>
      <img src="/static/image/business-description.png" alt="" />
      <ul>
        <li>
          <Typography.Text>
            {t('dmsProject.businessDescription.project')}
          </Typography.Text>
        </li>
        <li>
          <Typography.Text>
            {t('dmsProject.businessDescription.business')}
          </Typography.Text>
        </li>
        <li>
          <Typography.Text>
            {t('dmsProject.businessDescription.dataSource')}
          </Typography.Text>
        </li>
      </ul>
    </ProjectBusinessDescriptionStyleWrapper>
  );
};

export default BusinessDescription;
