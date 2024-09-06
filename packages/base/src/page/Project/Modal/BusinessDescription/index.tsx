import { Typography } from 'antd';
import { ProjectBusinessDescriptionStyleWrapper } from '../../style';
import { useTranslation } from 'react-i18next';
import { getPreferredLanguages } from '../../../../locale';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

const BusinessDescription = () => {
  const { t } = useTranslation();
  //todo 国际化二期需要提供一个获取当前语言的 hooks 以及切换语言功能
  const currentLanguage = getPreferredLanguages()?.[0].startsWith('en')
    ? SupportLanguage.enUS
    : SupportLanguage.zhCN;

  return (
    <ProjectBusinessDescriptionStyleWrapper>
      <Typography.Text>
        {t('dmsProject.businessDescription.title')}
      </Typography.Text>
      {/* todo: 图片样式优化以及图片文本内容中英文问题 */}
      {currentLanguage === SupportLanguage.zhCN && (
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
