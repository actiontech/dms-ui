import { Typography, Space, Divider, Card } from 'antd';
import { DMS_DEFAULT_WEB_TITLE } from '../../../data/common';
import BasicButton from '../../BasicButton';
import { VersionComparisonStyleWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import BasicTag from '../../BasicTag';
import { versionList } from '../index.data';

const VersionComparison: React.FC = () => {
  const { t } = useTranslation();

  const renderHeader = (title: string, buttonLink: string, aLink: string) => {
    return (
      <>
        <Typography.Title level={5}>{t(title)}</Typography.Title>
        <Divider />
        <BasicButton
          type="primary"
          href={buttonLink}
          target="_blank"
          className="apply-button"
        >
          {t('common.version.startApply')}
        </BasicButton>
        <Typography.Link
          className="contact-link"
          href={aLink}
          type="secondary"
          target="_blank"
        >
          {t('common.version.contactUs')}
        </Typography.Link>
      </>
    );
  };

  const renderDesc = (content: string) => {
    return (
      <Space direction="vertical" size={8} className="content-list">
        {content.split('\n').map((item, index) => {
          return (
            <Typography.Text type="secondary" key={index}>
              {item}
            </Typography.Text>
          );
        })}
      </Space>
    );
  };

  const renderContent = () => {
    return versionList.map((item) => {
      return (
        <Card hoverable key={item.key}>
          <Space
            direction="vertical"
            className="version-item"
            align="center"
            size={16}
          >
            {renderHeader(item.title, item.applyLink, item.contactLink)}
            {renderDesc(t(item.contentDesc))}
          </Space>
        </Card>
      );
    });
  };

  return (
    <VersionComparisonStyleWrapper className="full-width-element">
      <BasicTag color="geekblue" size="large">
        {t('common.version.currentVersion')}: {DMS_DEFAULT_WEB_TITLE}
        {/* #if [demo] */}
        {t('common.version.demo')}
        {/*#elif [ce] */}
        {t('common.version.ce')}
        {/* #endif */}
      </BasicTag>
      <div className="content-wrap">{renderContent()}</div>
    </VersionComparisonStyleWrapper>
  );
};

export default VersionComparison;
