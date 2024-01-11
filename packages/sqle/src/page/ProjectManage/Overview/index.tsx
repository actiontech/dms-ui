import { useTranslation } from 'react-i18next';
import { ConfigProvider, Space, Row, Col } from 'antd';
import { PageHeader } from '@actiontech/shared';
import { SyncOutlined } from '@ant-design/icons';

import useThemeStyleData from '../../../hooks/useThemeStyleData';
import { OverviewStyleWrapper } from './style';

import ProjectScore from './component/ProjectScore';
import SqlCount from './component/SqlCount';
import DataSourceCount from './component/DataSourceCount';
import OrderStatus from './component/OrderStatus';
import OrderRiskList from './component/OrderRiskList';
import ScanRiskList from './component/ScanRiskList';
import ScanTask from './component/ScanTask';

import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { useCallback, useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const Overview = () => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const { projectID } = useCurrentProject();

  const onRefreshPage = useCallback(() => {
    eventEmitter.emit(EmitterKey.Refresh_Project_Overview);
  }, []);

  useEffect(() => {
    onRefreshPage();
  }, [onRefreshPage, projectID]);

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 20,
          paddingLG: 20,
          paddingSM: 20,
          paddingXS: 20,
          colorBgContainer: sqleTheme.reportStatistics.bgColor
        }
      }}
    >
      <PageHeader
        fixed
        title={
          <Space size={10}>
            <div>{t('projectManage.projectOverview.pageTitle')}</div>
            <SyncOutlined onClick={onRefreshPage} className="refresh-icon" />
          </Space>
        }
      />
      <OverviewStyleWrapper>
        <Row
          justify="center"
          align="top"
          gutter={20}
          className="chart-area-overview"
        >
          <Col span={6}>
            <Row>
              <Col span={24}>
                <div className="item-wrapper height344 project-score">
                  <ProjectScore />
                </div>
              </Col>
            </Row>
            <Row className="marginTop20">
              <Col span={24}>
                <div className="item-wrapper height352 sql-count">
                  <SqlCount />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <div className="item-wrapper height344 data-source-count">
                  <DataSourceCount />
                </div>
              </Col>
            </Row>
            <Row className="marginTop20">
              <Col span={24}>
                <div className="item-wrapper height352 order">
                  <OrderStatus />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={6} className="right-chart">
            <ScanTask />
          </Col>
          <Col span={24}>
            <Row className="marginTop20" gutter={20}>
              <Col span={12}>
                <div className="item-wrapper height668 order-risk">
                  <OrderRiskList />
                </div>
              </Col>
              <Col span={12}>
                <div className="item-wrapper height668 scan-risk">
                  <ScanRiskList />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </OverviewStyleWrapper>
    </ConfigProvider>
  );
};

export default Overview;
