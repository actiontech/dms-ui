import { Card, Space, Typography, Col, Row } from 'antd';
import { EnterpriseFeatureDisplayProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { CEIndexStyleWrapper } from './style';
import Icon from '@ant-design/icons';
import BasicButton from '../BasicButton';
import { DMS_DEFAULT_WEB_TITLE } from '../../data/common';
import EmptyBox from '../EmptyBox';
import VersionComparison from './components/VersionComparison';
import classNames from 'classnames';
import { HeadphoneOutlined, BookMarkOutlined } from '@actiontech/icons';

const EnterpriseFeatureDisplay: React.FC<EnterpriseFeatureDisplayProps> = ({
  children,
  eeFeatureDescription,
  featureName,
  isConfigPage = false,
  showTitle = true
}) => {
  const { t } = useTranslation();

  // #if [ce]
  const renderFeatureDescNode = () => (
    <div className="left">
      <EmptyBox if={!isConfigPage}>
        <Typography.Title level={5} className="title">
          {t('common.enterpriseFeatureDisplay.featureDescription')}
        </Typography.Title>
      </EmptyBox>

      {eeFeatureDescription}
      <VersionComparison />
    </div>
  );

  const renderBookMarkCard = () => (
    <Card className="ce-card-info" hoverable>
      <Icon
        component={() => <BookMarkOutlined width="160" height="140" />}
        className="bg-icon"
      />
      <div className="info-cont-wrapper">
        <div className="title">Action {DMS_DEFAULT_WEB_TITLE}</div>
        <p className="cont-tip">
          {t('common.enterpriseFeatureDisplay.compareLink')}
        </p>
        <div className="button-group-wrapper">
          <a
            target="_blank"
            href="https://actiontech.github.io/sqle-docs/docs/support/compare"
            rel="noreferrer"
          >
            <BasicButton type="primary">
              {t('common.enterpriseFeatureDisplay.userBook')}
            </BasicButton>
          </a>
        </div>
      </div>
    </Card>
  );

  const renderCustomServiceCard = () => (
    <Card className="ce-card-info" hoverable>
      <Icon
        component={() => <HeadphoneOutlined width="160" height="140" />}
        className="bg-icon"
      />
      <div className="info-cont-wrapper">
        <div className="title">Action {DMS_DEFAULT_WEB_TITLE}</div>
        <p className="cont-tip">
          {t('common.enterpriseFeatureDisplay.businessLink', {
            featureName
          })}
        </p>
        <Space size={[12, 0]} className="button-group-wrapper">
          <a
            target="_blank"
            href="https://github.com/actiontech/sqle"
            rel="noreferrer"
          >
            <BasicButton type="primary">SQLE Github</BasicButton>
          </a>

          <a target="_blank" href="https://www.actionsky.com/" rel="noreferrer">
            <BasicButton type="primary">
              {t('common.enterpriseFeatureDisplay.linkUs')}
            </BasicButton>
          </a>
        </Space>
      </div>
    </Card>
  );
  const renderAdditionalAttentionNode = () => (
    <div className="right">
      <EmptyBox if={!isConfigPage}>
        <Typography.Title level={5} className="title">
          {t('common.enterpriseFeatureDisplay.additionalAttention')}
        </Typography.Title>
      </EmptyBox>
      {renderCustomServiceCard()}
      {renderBookMarkCard()}
    </div>
  );
  // #endif

  return (
    <>
      {/* #if [ce] */}
      <CEIndexStyleWrapper>
        {isConfigPage ? (
          <section
            className={classNames('config-mode-wrapper', {
              'none-padding-top': !showTitle
            })}
          >
            <div hidden={!showTitle} className="title">
              {featureName}
            </div>
            {renderFeatureDescNode()}
            {renderAdditionalAttentionNode()}
          </section>
        ) : (
          <Row className="common-mode-wrapper">
            <Col span={17}>{renderFeatureDescNode()}</Col>
            <Col span={7}>{renderAdditionalAttentionNode()}</Col>
          </Row>
        )}
      </CEIndexStyleWrapper>

      {/* #elif [ee] */}
      {children}

      {/* #endif */}
    </>
  );
};

export default EnterpriseFeatureDisplay;
