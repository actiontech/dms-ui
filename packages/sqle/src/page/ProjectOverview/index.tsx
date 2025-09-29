import { useTranslation } from 'react-i18next';
import { Space, Row, Col } from 'antd';
import { PageHeader, EmptyBox } from '@actiontech/dms-kit';
import { SyncOutlined } from '@ant-design/icons';
import { OverviewStyleWrapper } from './style';
import ProjectScore from './component/ProjectScore';
import SqlCount from './component/SqlCount';
import DataSourceCount from './component/DataSourceCount';
import OrderStatus from './component/OrderStatus';
import OrderRiskList from './component/OrderRiskList';
import DataSourcePerformance from './component/DataSourcePerformance';
import OptimizationDistribution from './component/OptimizationDistribution';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import { useCallback, useEffect } from 'react';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
const Overview = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const { moduleFeatureSupport } = usePermission();
  const onRefreshPage = useCallback(() => {
    eventEmitter.emit(EmitterKey.Refresh_Project_Overview);
  }, []);
  useEffect(() => {
    onRefreshPage();
  }, [onRefreshPage, projectID]);
  return (
    <>
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
          <Col span={12}>
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
          {/* todo 智能扫描重构 先隐藏  
           <Col span={6} className="right-chart">
            <ScanTask />
           </Col> */}
          <EmptyBox if={moduleFeatureSupport.sqlOptimization}>
            <Col span={24}>
              <Row className="marginTop20" gutter={20}>
                <Col span={12}>
                  <div className="item-wrapper height352 order-risk">
                    <OptimizationDistribution />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="item-wrapper height352 scan-risk">
                    <DataSourcePerformance />
                  </div>
                </Col>
              </Row>
            </Col>
          </EmptyBox>
          <Col span={24}>
            <Row className="marginTop20" gutter={20}>
              <Col span={24}>
                <div className="item-wrapper height668 order-risk">
                  <OrderRiskList />
                </div>
              </Col>
              {/* todo 智能扫描重构 先隐藏 
               <Col span={12}>
                <div className="item-wrapper height668 scan-risk">
                  <ScanRiskList />
                </div>
               </Col> */}
            </Row>
          </Col>
        </Row>
      </OverviewStyleWrapper>
    </>
  );
};
export default Overview;
