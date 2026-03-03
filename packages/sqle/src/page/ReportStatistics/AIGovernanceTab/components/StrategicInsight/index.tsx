import { useRequest } from 'ahooks';
import { Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AiHubService } from '@actiontech/shared/lib/api/sqle';
import {
  AiStrategicInsightBgOutlined,
  StrategicValueOutlined
} from '@actiontech/icons';
import CardWrapper from '../../../../../components/CardWrapper';
import EmitterKey from '../../../../../data/EmitterKey';
import eventEmitter from '../../../../../utils/EventEmitter';
import ModuleTitle from '../ModuleTitle';
import { StrategicInsightStyleWrapper } from './style';
import EfficiencyCards from './components/EfficiencyCards';

const { Title, Paragraph } = Typography;

const StrategicInsight: React.FC = () => {
  const { t } = useTranslation();

  const {
    data: strategicData,
    loading,
    run: refresh
  } = useRequest(() => {
    return AiHubService.GetAIHubStrategicValue().then((res) => {
      return res.data?.data;
    });
  });

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Report_Statistics,
      () => refresh()
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <StrategicInsightStyleWrapper>
      <div className="strategic-insight-header">
        <ModuleTitle
          icon={<StrategicValueOutlined />}
          title={t(
            'reportStatistics.aiGovernance.strategicInsight.moduleTitle'
          )}
          description={t(
            'reportStatistics.aiGovernance.strategicInsight.moduleDesc'
          )}
        />
      </div>
      {loading ? (
        <CardWrapper title="" enabledLoading />
      ) : (
        <div className="strategic-cards">
          <div className="value-milestone-banner">
            <div className="milestone-bg-icon-wrapper">
              <AiStrategicInsightBgOutlined className="milestone-bg-icon" />
            </div>
            <div className="milestone-content">
              <div className="milestone-main">
                {/* <span className="milestone-icon-circle">
                  <AiStrategicInsightOutlined className="milestone-header-icon" />
                </span> */}
                <div className="milestone-text">
                  <Title level={4} className="milestone-title">
                    {strategicData?.ai_strategic_insight?.title || '-'}
                  </Title>
                  <Paragraph className="milestone-description">
                    {strategicData?.ai_strategic_insight?.description || '-'}
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>
          {strategicData?.efficiency_cards && (
            <EfficiencyCards cards={strategicData.efficiency_cards} />
          )}
        </div>
      )}
    </StrategicInsightStyleWrapper>
  );
};

export default StrategicInsight;
