import { Typography, Space, Divider } from 'antd';
import BasicButton from '../../BasicButton';
import {
  VersionComparisonStyleWrapper,
  VersionComparisonItemCardStyleWrapper
} from '../style';
import { useTranslation } from 'react-i18next';
import BasicTag from '../../BasicTag';
import { versionList } from '../index.data';
import { VersionComparisonItem } from '../index.type';
import { IconCheckout } from '../../../Icon/common';

const VersionComparison: React.FC = () => {
  const { t } = useTranslation();

  const renderHeader = (data: VersionComparisonItem) => {
    return (
      <>
        <Typography.Title level={4}>{t(data.title)}</Typography.Title>
        <Typography.Text className="term-wrap">
          {data.termText ? t(data.termText) : ''}
        </Typography.Text>
        <BasicButton
          type="primary"
          href={data.applyLink}
          target="_blank"
          className="apply-button"
        >
          {t(data.buttonText)}
        </BasicButton>
        <Typography.Text className="version-subTitle-wrap">
          {t(data.subtitle)}
        </Typography.Text>
        <Divider />
      </>
    );
  };

  const renderDesc = (content: string) => {
    return (
      <Space direction="vertical" size={8} className="content-list">
        {content.split('\n').map((item, index) => {
          return (
            <Space
              key={index}
              align="start"
              className="full-width-element version-desc-wrap"
            >
              <IconCheckout></IconCheckout>
              <Typography.Text key={index}>{item}</Typography.Text>
            </Space>
          );
        })}
      </Space>
    );
  };

  const renderContent = () => {
    return versionList.map((item) => {
      return (
        <VersionComparisonItemCardStyleWrapper
          hoverable
          key={item.key}
          color={item.color}
          className="version-card"
        >
          <Space className="version-tag-wrap">
            <BasicTag size="large" color={item.color}>
              {t(item.type)}
            </BasicTag>
          </Space>
          <Space
            direction="vertical"
            className="version-item"
            align="center"
            size={16}
          >
            {renderHeader(item)}
            {renderDesc(t(item.contentDesc))}
          </Space>
        </VersionComparisonItemCardStyleWrapper>
      );
    });
  };

  return (
    <VersionComparisonStyleWrapper
      className="full-width-element version-comparison-wrap"
      direction="vertical"
    >
      <div className="content-wrap">{renderContent()}</div>
      <div>
        <Typography.Text>{t('common.version.bottomDesc')}</Typography.Text>
        <Typography.Link
          href="https://actiontech.github.io/sqle-docs/docs/support/compare"
          target="_blank"
        >
          {t('common.version.functionalComparison')}
        </Typography.Link>
      </div>
    </VersionComparisonStyleWrapper>
  );
};

export default VersionComparison;
