import { Typography } from 'antd';
import { ProjectBusinessDescriptionStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { usePreferredLanguages } from '@actiontech/shared/lib/global';

const BusinessDescription = () => {
  const { t } = useTranslation();

  const { preferredZhCN } = usePreferredLanguages();

  return (
    <ProjectBusinessDescriptionStyleWrapper>
      <Typography.Text>
        {t('dmsProject.businessDescription.title')}
      </Typography.Text>
      {/* todo: 图片样式优化以及图片文本内容中英文问题 */}
      {preferredZhCN && (
        <img src="/static/image/business-description.png" alt="" />
      )}
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
