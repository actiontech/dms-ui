import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';
import { PageHeader } from '@actiontech/dms-kit';
import { SyncOutlined } from '@ant-design/icons';
import { EEIndexStyleWrapper } from '../style';
import CardWrapper from '../../../components/CardWrapper';
import DatabaseTypeOrder from './component/charts/DatabaseTypeOrder';
import DatabaseSourceOrder from './component/charts/DatabaseSourceOrder';
import LicenseStatistics from './component/charts/LicenseStatistics';
import WorkOrderState from './component/charts/WorkOrderState';
import DiffOrderReject from './component/topList/DiffOrderReject';
import SqlOnLineSpendTime from './component/topList/SqlOnLineSpendTime';
import OrderQuantityTrend from './component/charts/OrderQuantityTrend';
import CardNumberShow from './component/cardNumberShow';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
const EEIndex = () => {
  const { t } = useTranslation();
  const onRefreshPage = () => {
    eventEmitter.emit(EmitterKey.Refresh_Report_Statistics);
  };
  return (
    <>
      <PageHeader
        fixed
        title={
          <Space size={10}>
            <div>{t('reportStatistics.title')}</div>
            <SyncOutlined onClick={onRefreshPage} className="refresh-icon" />
          </Space>
        }
      />
      <EEIndexStyleWrapper className="report-wrapper">
        {/* line 1: card */}
        <CardNumberShow />
        {/* line 2: order */}
        <Row justify="center" align="top" gutter={20} className="">
          <Col span={24} xxl={12}>
            <div className="item-wrapper order-wrapper marginTop20">
              <OrderQuantityTrend />
            </div>
          </Col>
          <Col span={24} xxl={12}>
            <div className="item-wrapper order-wrapper marginTop20">
              <CardWrapper title={t('reportStatistics.workOrderState.title')}>
                <WorkOrderState />
              </CardWrapper>
            </div>
          </Col>
        </Row>
        {/* line 3: order */}
        <Row justify="center" align="top" gutter={20} className="">
          <Col span={24} lg={24} xl={8} xxl={8}>
            <div className="item-wrapper order-wrapper2 marginTop20">
              <CardWrapper
                title={t('reportStatistics.databaseTypeOrder.title')}
              >
                <DatabaseTypeOrder />
              </CardWrapper>
            </div>
          </Col>
          <Col span={24} lg={24} xl={8} xxl={8}>
            <div className="item-wrapper order-wrapper2 marginTop20">
              <CardWrapper
                title={t('reportStatistics.databaseSourceOrder.title')}
              >
                <DatabaseSourceOrder />
              </CardWrapper>
            </div>
          </Col>
          <Col span={24} lg={24} xl={8} xxl={8}>
            <div className="item-wrapper order-wrapper2 marginTop20">
              <CardWrapper
                title={t('reportStatistics.licenseStatistics.title')}
              >
                <LicenseStatistics />
              </CardWrapper>
            </div>
          </Col>
        </Row>
        {/* line 4: top list*/}
        <Row justify="center" align="top" gutter={20} className="">
          <Col span={24} xxl={12}>
            <div className="item-wrapper top-list-wrapper marginTop20">
              <CardWrapper
                title={t('reportStatistics.topList.diffOrderReject.title')}
              >
                <DiffOrderReject />
              </CardWrapper>
            </div>
          </Col>
          <Col span={24} xxl={12}>
            <div className="item-wrapper top-list-wrapper marginTop20">
              <CardWrapper
                title={t('reportStatistics.topList.sqlOnLineSpendTime.title')}
              >
                <SqlOnLineSpendTime />
              </CardWrapper>
            </div>
          </Col>
        </Row>
      </EEIndexStyleWrapper>
    </>
  );
};
export default EEIndex;
