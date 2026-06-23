import { useMemo, useState } from 'react';
import { Button, Col, DatePicker, Row } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { RefreshOutlined } from '@actiontech/icons';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import CardWrapper from 'sqle/src/components/CardWrapper';
import { UserActivityStyleWrapper } from './style';
import SummaryCards from './components/SummaryCards';
import DailyTrendChart from './components/DailyTrendChart';
import ModuleDistributionChart from './components/ModuleDistributionChart';
import HourlyDistributionChart from './components/HourlyDistributionChart';
import UserRankingTable from './components/UserRankingTable';
import { DATE_FORMAT, getDefaultStatDate, getTrendDateRange } from './utils';

const UserActivity = () => {
  const { t } = useTranslation();
  const [statDate, setStatDate] = useState<Dayjs>(getDefaultStatDate());
  const [trendRange, setTrendRange] = useState<[Dayjs, Dayjs]>(() => {
    const [from, to] = getTrendDateRange(getDefaultStatDate());
    return [dayjs(from), dayjs(to)];
  });

  const statDateStr = useMemo(() => statDate.format(DATE_FORMAT), [statDate]);
  const trendFrom = useMemo(
    () => trendRange[0].format(DATE_FORMAT),
    [trendRange]
  );
  const trendTo = useMemo(
    () => trendRange[1].format(DATE_FORMAT),
    [trendRange]
  );

  const {
    data: summary,
    loading: summaryLoading,
    refresh: refreshSummary
  } = useRequest(
    () =>
      DmsApi.UserActivityService.GetUserActivitySummaryV1({
        stat_date: statDateStr
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        throw new Error(res.data.message);
      }),
    { refreshDeps: [statDateStr] }
  );

  const {
    data: dailyTrend,
    loading: dailyTrendLoading,
    error: dailyTrendError,
    refresh: refreshDailyTrend
  } = useRequest(
    () =>
      DmsApi.UserActivityService.GetUserActivityDailyTrendV1({
        filter_date_from: trendFrom,
        filter_date_to: trendTo
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data ?? [];
        }
        throw new Error(res.data.message);
      }),
    { refreshDeps: [trendFrom, trendTo] }
  );

  const {
    data: moduleDistribution,
    loading: moduleLoading,
    error: moduleError,
    refresh: refreshModule
  } = useRequest(
    () =>
      DmsApi.UserActivityService.GetUserActivityModuleDistributionV1({
        stat_date: statDateStr
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data ?? [];
        }
        throw new Error(res.data.message);
      }),
    { refreshDeps: [statDateStr] }
  );

  const {
    data: hourlyDistribution,
    loading: hourlyLoading,
    error: hourlyError,
    refresh: refreshHourly
  } = useRequest(
    () =>
      DmsApi.UserActivityService.GetUserActivityHourlyDistributionV1({
        stat_date: statDateStr
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data ?? [];
        }
        throw new Error(res.data.message);
      }),
    { refreshDeps: [statDateStr] }
  );

  const refreshAll = () => {
    refreshSummary();
    refreshDailyTrend();
    refreshModule();
    refreshHourly();
  };

  return (
    <UserActivityStyleWrapper className="user-activity-page">
      <div className="page-header">
        <div className="page-title">{t('userActivity.title')}</div>
        <div className="page-filters">
          <span>{t('userActivity.statDate')}</span>
          <DatePicker
            value={statDate}
            allowClear={false}
            onChange={(value) => {
              if (!value) {
                return;
              }
              setStatDate(value);
              const [from, to] = getTrendDateRange(value);
              setTrendRange([dayjs(from), dayjs(to)]);
            }}
          />
          <span>{t('userActivity.dateRange')}</span>
          <DatePicker.RangePicker
            value={trendRange}
            allowClear={false}
            onChange={(values) => {
              if (!values?.[0] || !values?.[1]) {
                return;
              }
              setTrendRange([values[0], values[1]]);
            }}
          />
          <Button icon={<RefreshOutlined />} onClick={refreshAll}>
            {t('userActivity.refresh')}
          </Button>
        </div>
      </div>

      <SummaryCards loading={summaryLoading} data={summary} />

      <Row gutter={[16, 16]} className="chart-section">
        <Col span={24} xxl={12}>
          <CardWrapper title={t('userActivity.dailyTrend.title')}>
            <DailyTrendChart
              loading={dailyTrendLoading}
              errorMessage={dailyTrendError?.message}
              data={dailyTrend}
              onRefresh={refreshDailyTrend}
            />
          </CardWrapper>
        </Col>
        <Col span={24} xxl={12}>
          <CardWrapper title={t('userActivity.moduleDistribution.title')}>
            <ModuleDistributionChart
              loading={moduleLoading}
              errorMessage={moduleError?.message}
              data={moduleDistribution}
              onRefresh={refreshModule}
            />
          </CardWrapper>
        </Col>
        <Col span={24} xxl={12}>
          <CardWrapper title={t('userActivity.hourlyDistribution.title')}>
            <HourlyDistributionChart
              loading={hourlyLoading}
              errorMessage={hourlyError?.message}
              data={hourlyDistribution}
              onRefresh={refreshHourly}
            />
          </CardWrapper>
        </Col>
        <Col span={24} xxl={12}>
          <UserRankingTable filterDateFrom={trendFrom} filterDateTo={trendTo} />
        </Col>
      </Row>
    </UserActivityStyleWrapper>
  );
};

export default UserActivity;
