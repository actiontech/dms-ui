import { Card, Space, Typography, Col, Row } from 'antd5';
import { EnterpriseFeatureDisplayProps } from '.';
import { useTranslation } from 'react-i18next';
import { CEIndexStyleWrapper } from './style';
import Icon from '@ant-design/icons';
import BasicButton from '../BasicButton';
import {
  IconBookMark,
  IconCustomService
} from '../Icons/EnterpriseFeatureDisplay';
import EmptyBox from '../EmptyBox';

const EnterpriseFeatureDisplay: React.FC<EnterpriseFeatureDisplayProps> = ({
  children,
  eeFeatureDescription,
  featureName,
  isConfigPage = false
}) => {
  const { t } = useTranslation();
  const renderFeatureDescNode = () => (
    <div className="left">
      <EmptyBox if={!isConfigPage}>
        <Typography.Title level={5} className="title">
          {t('common.enterpriseFeatureDisplay.featureDescription')}
        </Typography.Title>
      </EmptyBox>

      {eeFeatureDescription}
    </div>
  );

  const renderBookMarkCard = () => (
    <Card className="ce-card-info" hoverable>
      <Icon component={IconBookMark} className="bg-icon" />
      <div className="info-cont-wrapper">
        <div className="title">Action DMS</div>
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
      <Icon component={IconCustomService} className="bg-icon" />
      <div className="info-cont-wrapper">
        <div className="title">Action DMS</div>
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

  return (
    <>
      {/* IFTRUE_isCE */}
      <CEIndexStyleWrapper>
        {isConfigPage ? (
          <section className="config-mode-wrapper">
            <div className="title">{featureName}</div>
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
      {/* FITRUE_isCE */}
      {/* IFTRUE_isEE */}
      {children}
      {/* FITRUE_isEE */}
    </>
  );
};

export default EnterpriseFeatureDisplay;
