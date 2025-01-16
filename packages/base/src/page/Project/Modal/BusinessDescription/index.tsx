import { Typography } from 'antd';
import { ProjectBusinessDescriptionStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

const BusinessDescription = () => {
  const { t } = useTranslation();

  const { language } = useCurrentUser();

  return (
    <ProjectBusinessDescriptionStyleWrapper>
      <Typography.Text>
        {t('dmsProject.businessDescription.title')}
      </Typography.Text>
      {/* todo: 图片样式优化以及图片文本内容中英文问题 */}
      {language === SupportLanguage.zhCN && (
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
